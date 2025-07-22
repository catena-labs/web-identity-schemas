import { test, expect, describe } from "vitest"
import { keyUses, keyOperations } from "../src/constants/jwk"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import ecP256Valid from "./fixtures/jwk/ec-p256-valid.json"
import invalidBadBase64url from "./fixtures/jwk/invalid-bad-base64url.json"
import invalidMissingKty from "./fixtures/jwk/invalid-missing-kty.json"
import jwksGithubTokenActions from "./fixtures/jwk/jwks-token.actions.githubusercontent.json"
import octValid from "./fixtures/jwk/oct-valid.json"
import okpEd25519Valid from "./fixtures/jwk/okp-ed25519-valid.json"
import rsaPrivateValid from "./fixtures/jwk/rsa-private-valid.json"
import rsaPublicValid from "./fixtures/jwk/rsa-public-valid.json"

const namespaces = {
  valibot,
  zod
}

describe("jwk", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("KeyUseSchema", () => {
      test("valid uses", () => {
        for (const use of keyUses) {
          expect(use).toMatchSchema(schemas.KeyUseSchema)
        }
      })

      test("invalid uses", () => {
        const invalidUses = ["sign", "encrypt", "SIG", "ENC", "", "verify"]

        for (const use of invalidUses) {
          expect(use).not.toMatchSchema(schemas.KeyUseSchema)
        }
      })
    })

    describe("KeyOpsSchema", () => {
      test("valid operations", () => {
        const validOps = [
          ...keyOperations.map((op) => [op]),
          ["sign", "verify"],
          ["encrypt", "decrypt"],
          ["sign", "verify", "deriveKey"]
        ]

        for (const ops of validOps) {
          expect(ops).toMatchSchema(schemas.KeyOpsSchema)
        }
      })

      test("invalid operations", () => {
        const invalidOps = [
          ["invalid"],
          ["SIGN"], // Wrong case
          ["sign", "invalid"],
          "sign", // Not an array
          [""]
        ]

        for (const ops of invalidOps) {
          expect(ops).not.toMatchSchema(schemas.KeyOpsSchema)
        }
      })
    })

    describe("RsaJwkSchema", () => {
      test("valid RSA public key", () => {
        expect(rsaPublicValid).toMatchSchema(schemas.RsaJwkSchema)
      })

      test("valid RSA private key", () => {
        expect(rsaPrivateValid).toMatchSchema(schemas.RsaJwkSchema)
      })

      test("invalid RSA key", () => {
        const invalidRsaKeys = [
          { kty: "RSA" }, // Missing n and e
          { kty: "RSA", n: "inv@lid", e: "AQAB" }, // Invalid base64url
          { kty: "RSA", n: "SGVsbG8", e: "inv@lid" }, // Invalid base64url
          { kty: "EC", n: "SGVsbG8", e: "AQAB" } // Wrong kty
        ]

        for (const key of invalidRsaKeys) {
          expect(key).not.toMatchSchema(schemas.RsaJwkSchema)
        }
      })
    })

    describe("EcJwkSchema", () => {
      test("valid EC public key", () => {
        expect(ecP256Valid).toMatchSchema(schemas.EcJwkSchema)
      })

      test("valid EC private key", () => {
        const validEcPrivateKey = {
          kty: "EC",
          crv: "P-256",
          x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
          y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
          d: "870MB6gfuTJ4HtUnUvYMyJpr5eUZNP4Bk43bVdj3eAE"
        }

        expect(validEcPrivateKey).toMatchSchema(schemas.EcJwkSchema)
      })

      test("different curves", () => {
        const curves = [
          "P-256",
          "secp256r1",
          "P-256K",
          "secp256k1",
          "P-384",
          "P-521"
        ]

        for (const crv of curves) {
          const ecKey = {
            kty: "EC",
            crv,
            x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
            y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
          }

          expect(ecKey).toMatchSchema(schemas.EcJwkSchema)
        }
      })
    })

    describe("OctJwkSchema", () => {
      test("valid symmetric key", () => {
        expect(octValid).toMatchSchema(schemas.OctJwkSchema)
      })
    })

    describe("OkpJwkSchema", () => {
      test("valid Ed25519 key", () => {
        expect(okpEd25519Valid).toMatchSchema(schemas.OkpJwkSchema)
      })

      test("valid X25519 key", () => {
        const validX25519Key = {
          kty: "OKP",
          crv: "X25519",
          x: "3p7bfXt9wbTTW2HC7OQ1Nz-DQ8hbeGdNrfx-FG-IK08",
          use: "enc"
        }

        expect(validX25519Key).toMatchSchema(schemas.OkpJwkSchema)
      })
    })

    describe("github token actions", () => {
      test("valid JWKS", () => {
        expect(jwksGithubTokenActions).toMatchSchema(
          schemas.JsonWebKeySetSchema
        )
      })
    })

    describe("JsonWebKeySchema", () => {
      test("discriminated union validation", () => {
        const keys = [
          {
            kty: "RSA",
            n: "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw",
            e: "AQAB"
          },
          {
            kty: "EC",
            crv: "P-256",
            x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
            y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
          },
          {
            kty: "oct",
            k: "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow"
          },
          {
            kty: "OKP",
            crv: "Ed25519",
            x: "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"
          }
        ]

        for (const key of keys) {
          expect(key).toMatchSchema(schemas.JsonWebKeySchema)
        }
      })

      test("invalid key types", () => {
        const invalidKeys = [
          { kty: "UNKNOWN" }, // Invalid key type
          { kty: "RSA", x: "invalid" }, // Wrong fields for RSA
          { kty: "EC", n: "invalid" }, // Wrong fields for EC
          { kty: "oct", crv: "P-256" }, // Wrong fields for oct
          { kty: "OKP", n: "invalid" }, // Wrong fields for OKP
          {} // Missing kty
        ]

        for (const key of invalidKeys) {
          expect(key).not.toMatchSchema(schemas.JsonWebKeySchema)
        }
      })
    })

    test("additional invalid key tests", () => {
      // Test invalid JWK with bad base64url encoding
      expect(invalidBadBase64url).not.toMatchSchema(schemas.JsonWebKeySchema)

      // Test invalid JWK missing required kty field
      expect(invalidMissingKty).not.toMatchSchema(schemas.JsonWebKeySchema)
    })
  })
})
