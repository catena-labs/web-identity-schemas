import { describe, it, expect } from "vitest"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"

const namespaces = {
  valibot,
  zod
}

describe("json-web-key", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("JsonWebKeySchema", () => {
      it("validates a valid RSA JWK", () => {
        const jwk = {
          kty: "RSA",
          n: "abc123_ABC-",
          e: "AQAB"
        }

        expect(jwk).toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("validates a valid EC JWK", () => {
        const jwk = {
          kty: "EC",
          crv: "P-256",
          x: "abc123_ABC-",
          y: "def456_DEF-"
        }

        expect(jwk).toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("validates a valid oct (symmetric) JWK", () => {
        const jwk = {
          kty: "oct",
          k: "abc123_ABC-"
        }

        expect(jwk).toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("validates a valid OKP JWK", () => {
        const jwk = {
          kty: "OKP",
          crv: "Ed25519",
          x: "abc123_ABC-"
        }

        expect(jwk).toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for missing required RSA fields", () => {
        const jwk = {
          kty: "RSA"
          // missing n and e
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for bad base64url in RSA n", () => {
        const jwk = {
          kty: "RSA",
          n: "bad$$value", // invalid base64url
          e: "AQAB"
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for unsupported kty value", () => {
        const jwk = {
          kty: "FOO"
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for invalid EC crv", () => {
        const jwk = {
          kty: "EC",
          crv: "P-999",
          x: "abc123_ABC-",
          y: "def456_DEF-"
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for invalid OKP crv", () => {
        const jwk = {
          kty: "OKP",
          crv: "BadCurve",
          x: "abc123_ABC-"
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })

      it("fails for oct missing k", () => {
        const jwk = {
          kty: "oct"
        }

        expect(jwk).not.toMatchSchema(schemas.JsonWebKeySchema)
      })
    })
  })
})
