import { test, expect, describe } from "vitest"

import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import jwsCompactValid from "./fixtures/jws/compact-valid.json"
import jwsObjectValid from "./fixtures/jws/object-valid.json"

const namespaces = {
  valibot,
  zod,
}

describe("jws", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("JwsStringSchema", () => {
      test("valid JWS strings", () => {
        const validStrings = [
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "a.b.c",
          "a.b.", // Unsecured JWS (empty signature)
        ]

        for (const jws of validStrings) {
          expect(jws).toMatchSchema(schemas.JwsStringSchema)
        }
      })

      test("invalid JWS strings", () => {
        const invalidStrings = [
          "",
          "a.b",
          "a.b.c.d",
          ".b.c",
          "a..c", // Empty payload not allowed
        ]

        for (const jws of invalidStrings) {
          expect(jws).not.toMatchSchema(schemas.JwsStringSchema)
        }
      })
    })

    describe("JwsParsedSchema (compact serialization string)", () => {
      test("valid compact JWS strings", () => {
        const validJws = [
          // header.payload.signature
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          // Minimal three non-empty parts
          "a.b.c",
          // alg "none": payload present, empty signature (RFC 7515 App A.5)
          "eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIn0.",
          "a.b.",
        ]

        for (const jws of validJws) {
          expect(jws).toMatchSchema(schemas.JwsParsedSchema, (result) => {
            const parts = jws.split(".")
            expect(result.protected).toBe(parts[0])
            expect(result.payload).toBe(parts[1])
            expect(result.signature).toBe(parts[2])
          })
        }
      })

      test("invalid compact JWS strings", () => {
        const invalidJws = [
          "", // Empty string
          "a.b", // Too few parts
          "a.b.c.d", // Too many parts
          "no.dots", // Too few parts
          ".b.c", // Empty header not allowed
          "a..c", // Empty payload not allowed for attached JWS
          "contains spaces.b.c", // Invalid chars
          "a+b/c.d.e", // Invalid base64url chars
        ]

        for (const jws of invalidJws) {
          expect(jws).not.toMatchSchema(schemas.JwsParsedSchema)
        }
      })
    })

    describe("DetachedJwsStringSchema", () => {
      test("valid detached JWS (empty payload)", () => {
        const validDetached = [
          "eyJhbGciOiJFUzI1NiJ9..signature",
          "header..signature",
        ]

        for (const jws of validDetached) {
          expect(jws).toMatchSchema(schemas.DetachedJwsStringSchema)
        }
      })

      test("invalid detached JWS", () => {
        const invalidDetached = [
          "header.payload.signature", // Not detached (payload present)
          "header.signature", // Missing one dot
          "..signature", // Empty header
          "header..", // Empty signature
        ]

        for (const jws of invalidDetached) {
          expect(jws).not.toMatchSchema(schemas.DetachedJwsStringSchema)
        }
      })
    })

    describe("JwsCompactSerializationSchema", () => {
      test("valid compact serialization object", () => {
        expect(jwsCompactValid).toMatchSchema(
          schemas.JwsCompactSerializationSchema,
        )
      })

      test("accepts empty signature (unsecured JWS)", () => {
        const unsecured = {
          protected: "eyJhbGciOiJub25lIn0",
          payload: "eyJpc3MiOiJ0ZXN0In0",
          signature: "",
        }

        expect(unsecured).toMatchSchema(schemas.JwsCompactSerializationSchema)
      })
    })

    describe("JwsObjectSchema", () => {
      test("valid JWS object from fixture", () => {
        expect(jwsObjectValid).toMatchSchema(schemas.JwsObjectSchema)
      })
    })

    describe("JWS JSON serialization", () => {
      const protectedHeader = "eyJhbGciOiJSUzI1NiJ9"
      const payload = "eyJzdWIiOiIxMjM0NTY3ODkwIn0"
      const signature =
        "EhkiHkoESI_cG3NPigFrxEBSasmG8EwZR3aKHLOz1-f7DKl9R4OVSgz9jTXnSTASLrOa1FKR8XOKgQ5V1KvHLA"

      test("valid flattened JSON serialization", () => {
        const flattened = {
          payload,
          protected: protectedHeader,
          signature,
        }

        expect(flattened).toMatchSchema(
          schemas.JwsFlattenedJsonSerializationSchema,
        )
      })

      test("valid general JSON serialization", () => {
        const general = {
          payload,
          signatures: [
            {
              protected: protectedHeader,
              signature,
            },
          ],
        }

        expect(general).toMatchSchema(schemas.JwsJsonSerializationSchema)
      })

      test("unsecured JWS (empty signature) in flattened and general forms", () => {
        const flattened = {
          payload,
          protected: "eyJhbGciOiJub25lIn0",
          signature: "",
        }
        expect(flattened).toMatchSchema(
          schemas.JwsFlattenedJsonSerializationSchema,
        )

        const general = {
          payload,
          signatures: [{ protected: "eyJhbGciOiJub25lIn0", signature: "" }],
        }
        expect(general).toMatchSchema(schemas.JwsJsonSerializationSchema)
      })

      test("flattened differs from general (no signatures array)", () => {
        const flattened = {
          payload,
          protected: protectedHeader,
          signature,
        }

        // Flattened form is not a valid general serialization (lacks signatures)
        expect(flattened).not.toMatchSchema(schemas.JwsJsonSerializationSchema)
      })
    })
  })
})
