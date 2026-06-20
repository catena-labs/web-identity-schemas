import { test, expect, describe } from "vitest"

import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import jweCompactValid from "./fixtures/jwe/compact-valid.json"
import jweObjectValid from "./fixtures/jwe/object-valid.json"

const namespaces = {
  valibot,
  zod,
}

describe("jwe", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("JweStringSchema (compact serialization string)", () => {
      test("valid compact JWE strings", () => {
        const validJwe = [
          // protected.encrypted_key.iv.ciphertext.tag
          "eyJhbGciOiJSU0ExXzUiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0.UGhIOguC7Iu.AxY8DCtDaGlsbGljb3RoZQ.KDlTtXchhZTGufMYmOYGS4.Mz-VPPyU4RlcuYv1IwIvzw",
          // Minimal five-part form
          "a.b.c.d.e",
          // dir / ECDH-ES: empty encrypted_key (RFC 7516)
          "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0..AxY8DCtDaGlsbGljb3RoZQ.KDlTtXchhZTGufMYmOYGS4.Mz-VPPyU4RlcuYv1IwIvzw",
          "a..c.d.e",
        ]

        for (const jwe of validJwe) {
          expect(jwe).toMatchSchema(schemas.JweStringSchema, (result) => {
            const parts = jwe.split(".")
            expect(result.protected).toBe(parts[0])
            expect(result.encrypted_key).toBe(parts[1])
            expect(result.iv).toBe(parts[2])
            expect(result.ciphertext).toBe(parts[3])
            expect(result.tag).toBe(parts[4])
          })
        }
      })

      test("invalid compact JWE strings", () => {
        const invalidJwe = [
          "", // Empty string
          "a.b.c.d", // Too few parts
          "a.b.c.d.e.f", // Too many parts
          "a.b.c.d.", // Empty tag not allowed
          ".b.c.d.e", // Empty protected header not allowed
          "a.b..d.e", // Empty iv not allowed
          "a.b.c..e", // Empty ciphertext not allowed
          "contains spaces.b.c.d.e", // Invalid chars
        ]

        for (const jwe of invalidJwe) {
          expect(jwe).not.toMatchSchema(schemas.JweStringSchema)
        }
      })
    })

    describe("JweCompactSerializationSchema", () => {
      test("valid compact serialization object", () => {
        expect(jweCompactValid).toMatchSchema(
          schemas.JweCompactSerializationSchema,
        )
      })
    })

    describe("JweObjectSchema", () => {
      test("valid JWE object from fixture", () => {
        expect(jweObjectValid).toMatchSchema(schemas.JweObjectSchema)
      })
    })

    describe("JWE JSON serialization", () => {
      const iv = "AxY8DCtDaGlsbGljb3RoZQ"
      const ciphertext = "KDlTtXchhZTGufMYmOYGS4"
      const tag = "Mz-VPPyU4RlcuYv1IwIvzw"
      const protectedHeader =
        "eyJhbGciOiJSU0ExXzUiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0"

      test("valid flattened JSON serialization", () => {
        const flattened = {
          protected: protectedHeader,
          encrypted_key: "UGhIOguC7Iu",
          iv,
          ciphertext,
          tag,
        }

        expect(flattened).toMatchSchema(
          schemas.JweFlattenedJsonSerializationSchema,
        )
      })

      test("valid general JSON serialization", () => {
        const general = {
          protected: protectedHeader,
          iv,
          ciphertext,
          tag,
          recipients: [
            {
              header: { alg: "RSA1_5" },
              encrypted_key: "UGhIOguC7Iu",
            },
          ],
        }

        expect(general).toMatchSchema(schemas.JweJsonSerializationSchema)
      })

      test("general serialization with dir (absent encrypted_key)", () => {
        const general = {
          protected: "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4R0NNIn0",
          iv,
          ciphertext,
          tag,
          recipients: [
            {
              // dir / ECDH-ES has no encrypted key (RFC 7516 section 7.2.1)
              header: { kid: "dir-key-1" },
            },
          ],
        }

        expect(general).toMatchSchema(schemas.JweJsonSerializationSchema)
      })

      test("flattened differs from general (no recipients array)", () => {
        const flattened = {
          protected: protectedHeader,
          encrypted_key: "UGhIOguC7Iu",
          iv,
          ciphertext,
          tag,
        }

        // Flattened form is not a valid general serialization (lacks recipients)
        expect(flattened).not.toMatchSchema(schemas.JweJsonSerializationSchema)
      })
    })
  })
})
