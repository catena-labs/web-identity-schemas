import { test, expect, describe } from "vitest"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import jwtInvalidNoneWithSignature from "./fixtures/jwt/invalid-none-with-signature.json"
import jwtObjectHs256Valid from "./fixtures/jwt/object-hs256-valid.json"
import jwtObjectNoneValid from "./fixtures/jwt/object-none-valid.json"

const namespaces = {
  valibot,
  zod
}

describe("jwt", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    test("fixture-based validation tests", () => {
      // Test valid HS256 JWT object from fixture
      expect(jwtObjectHs256Valid).toMatchSchema(schemas.JwtObjectSchema)

      // Test valid none algorithm JWT object from fixture
      expect(jwtObjectNoneValid).toMatchSchema(schemas.JwtObjectSchema)

      // Test invalid JWT with none algorithm but signature present
      expect(jwtInvalidNoneWithSignature).not.toMatchSchema(
        schemas.JwtObjectSchema
      )
    })

    describe("JwtStringSchema", () => {
      test("valid JWT strings", () => {
        const validJwts = [
          // Standard JWT
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
          // JWT with empty signature (unsecured)
          "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.",
          // Minimal valid format
          "a.b.c",
          "A.B.", // Empty signature
          "123.456.789"
        ]

        for (const jwt of validJwts) {
          expect(jwt).toMatchSchema(schemas.JwtStringPartsSchema, (result) => {
            const parts = jwt.split(".")
            expect(result.header).toBe(parts[0]!)
            expect(result.payload).toBe(parts[1]!)
            expect(result.signature).toBe(parts[2] ?? "")
          })
        }
      })

      test("invalid JWT strings", () => {
        const invalidJwts = [
          "only.two.parts.too.many", // Too many parts
          "only.one", // Too few parts
          "no.dots", // No separators
          "", // Empty string
          ".", // Only dots
          "..", // Only dots
          "a..c", // Empty middle part not allowed for payload
          ".b.c", // Empty header not allowed
          "a.b.c.d", // Too many parts
          "part1.part2.part3.part4.part5", // Way too many parts
          "contains+invalid.base64/chars.signature=", // Invalid base64url chars
          "contains spaces.in payload.signature" // Spaces not allowed
        ]

        for (const jwt of invalidJwts) {
          expect(jwt).not.toMatchSchema(schemas.JwtStringSchema)
        }
      })

      test("non-string inputs", () => {
        const nonStringInputs = [
          null,
          undefined,
          123,
          true,
          {},
          [],
          Symbol("jwt")
        ]

        for (const input of nonStringInputs) {
          expect(input).not.toMatchSchema(schemas.JwtStringSchema)
        }
      })
    })

    describe("JwtObjectSchema", () => {
      test("valid JWT object", () => {
        const validJwtObject = {
          header: {
            alg: "HS256",
            typ: "JWT"
          },
          payload: {
            sub: "1234567890",
            name: "John Doe",
            iat: 1516239022,
            exp: 1516242622,
            aud: "example.com",
            iss: "https://example.com"
          },
          signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        }

        expect(validJwtObject).toMatchSchema(
          schemas.JwtObjectSchema,
          (result) => {
            expect(result.header.alg).toBe("HS256")
            expect(result.payload.sub).toBe("1234567890")
            expect(result.signature).toBe(validJwtObject.signature)
          }
        )
      })

      test("minimal valid JWT object with unsecured algorithm", () => {
        const minimalJwtObject = {
          header: {
            alg: "none"
          },
          payload: {},
          signature: ""
        }

        expect(minimalJwtObject).toMatchSchema(
          schemas.JwtObjectSchema,
          (result) => {
            expect(result.header.alg).toBe("none")
          }
        )
      })

      test("header with various signed algorithms", () => {
        const signedAlgorithms = [
          "HS256",
          "HS384",
          "HS512",
          "RS256",
          "ES256",
          "PS256",
          "EdDSA"
        ] as const

        for (const alg of signedAlgorithms) {
          const jwtObject = {
            header: { alg },
            payload: { test: true },
            signature: "test-signature"
          }

          expect(jwtObject).toMatchSchema(schemas.JwtObjectSchema, (result) => {
            expect(result.header.alg).toBe(alg)
          })
        }
      })

      test("unsecured algorithm requires empty signature", () => {
        const validUnsecuredJwt = {
          header: { alg: "none" },
          payload: { test: true },
          signature: ""
        }

        expect(validUnsecuredJwt).toMatchSchema(
          schemas.JwtObjectSchema,
          (result) => {
            expect(result.header.alg).toBe("none")
            expect(result.signature).toBe("")
          }
        )

        // Test that unsecured algorithm with non-empty signature fails
        const invalidUnsecuredJwt = {
          header: { alg: "none" },
          payload: { test: true },
          signature: "test-signature"
        }

        expect(invalidUnsecuredJwt).not.toMatchSchema(schemas.JwtObjectSchema)
      })

      test("signed algorithms cannot have empty signature", () => {
        const signedAlgorithms = [
          "HS256",
          "RS256",
          "ES256",
          "PS256",
          "EdDSA"
        ] as const

        for (const alg of signedAlgorithms) {
          const invalidSignedJwt = {
            header: { alg },
            payload: { test: true },
            signature: ""
          }

          expect(invalidSignedJwt).not.toMatchSchema(schemas.JwtObjectSchema)
        }
      })

      test("header with JWK", () => {
        const jwtWithJwk = {
          header: {
            alg: "RS256",
            jwk: {
              kty: "RSA",
              n: "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
              e: "AQAB"
            }
          },
          payload: { test: true },
          signature: "test-signature"
        }

        expect(jwtWithJwk).toMatchSchema(schemas.JwtObjectSchema, (result) => {
          expect(result.header.jwk?.kty).toBe("RSA")
        })
      })

      test("payload with standard claims", () => {
        const jwtWithStandardClaims = {
          header: { alg: "HS256" },
          payload: {
            iss: "https://example.com",
            sub: "user123",
            aud: ["app1", "app2"],
            exp: 1516242622,
            nbf: 1516239022,
            iat: 1516239022,
            jti: "unique-token-id",
            // Custom claims
            email: "user@example.com",
            role: "admin",
            permissions: ["read", "write"]
          },
          signature: "test-signature"
        }

        expect(jwtWithStandardClaims).toMatchSchema(
          schemas.JwtObjectSchema,
          (result) => {
            expect(result.payload.iss).toBe("https://example.com")
            expect(result.payload.aud).toEqual(["app1", "app2"])
            expect(result.payload.exp).toBe(1516242622)
            expect(result.payload.email).toBe("user@example.com") // Custom claim
          }
        )
      })

      test("invalid JWT objects", () => {
        const invalidJwtObjects = [
          {}, // Missing required fields
          { header: {} }, // Missing payload and signature
          { header: { alg: "HS256" } }, // Missing payload and signature
          { header: { alg: "HS256" }, payload: {} }, // Missing signature
          { header: { alg: "INVALID" }, payload: {}, signature: "" }, // Invalid algorithm
          { header: {}, payload: {}, signature: "" }, // Missing alg in header
          { header: { alg: "HS256" }, payload: {}, signature: 123 }, // Wrong signature type
          { header: { alg: "HS256" }, payload: "not-object", signature: "" } // Wrong payload type
        ]

        for (const obj of invalidJwtObjects) {
          expect(obj).not.toMatchSchema(schemas.JwtObjectSchema)
        }
      })

      test("payload with invalid timestamp claims", () => {
        const invalidTimestampClaims = [
          { exp: -1 }, // Negative timestamp
          { nbf: 1.5 }, // Non-integer timestamp
          { iat: "not-a-number" }, // String instead of number
          { exp: null } // Null timestamp
        ]

        for (const claims of invalidTimestampClaims) {
          const jwtObject = {
            header: { alg: "HS256" },
            payload: claims,
            signature: "test"
          }

          expect(jwtObject).not.toMatchSchema(schemas.JwtObjectSchema)
        }
      })
    })
  })
})
