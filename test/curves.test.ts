import { test, expect, describe } from "bun:test"
import {
  ellipticCurves,
  octetKeyPairCurves,
  cryptographicCurves
} from "../src/constants/curves"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"

const namespaces = {
  valibot,
  zod
}

describe("curves", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("EllipticCurveSchema", () => {
      test("valid curves", () => {
        for (const curve of ellipticCurves) {
          expect(curve).toMatchSchema(schemas.EllipticCurveSchema)
        }
      })

      test("invalid curves", () => {
        const invalidCurves = [
          "Ed25519", // OKP curve, not elliptic curve
          "X25519", // OKP curve, not elliptic curve
          "P-999", // Non-existent curve
          "secp999r1", // Non-existent curve
          "prime256v1", // OpenSSL name, not standard
          "",
          "INVALID"
        ]

        for (const curve of invalidCurves) {
          expect(curve).not.toMatchSchema(schemas.EllipticCurveSchema)
        }
      })
    })

    describe("OctetKeyPairCurveSchema", () => {
      test("valid curves", () => {
        for (const curve of octetKeyPairCurves) {
          expect(curve).toMatchSchema(schemas.OctetKeyPairCurveSchema)
        }
      })

      test("invalid curves", () => {
        const invalidCurves = [
          "P-256", // Elliptic curve, not OKP curve
          "secp256k1", // Elliptic curve, not OKP curve
          "Curve25519", // Non-standard name
          "ed25519", // Wrong case
          "x25519", // Wrong case
          "",
          "INVALID"
        ]

        for (const curve of invalidCurves) {
          expect(curve).not.toMatchSchema(schemas.OctetKeyPairCurveSchema)
        }
      })
    })

    describe("CryptographicCurveSchema", () => {
      test("accepts all curves", () => {
        for (const curve of cryptographicCurves) {
          expect(curve).toMatchSchema(schemas.CryptographicCurveSchema)
        }
      })

      test("rejects invalid curves", () => {
        const invalidCurves = [
          "P-999", // Non-existent curve
          "secp999r1", // Non-existent curve
          "Curve25519", // Non-standard name
          "ed25519", // Wrong case
          "x25519", // Wrong case
          "",
          "INVALID"
        ]

        for (const curve of invalidCurves) {
          expect(curve).not.toMatchSchema(schemas.CryptographicCurveSchema)
        }
      })
    })
  })
})
