import { test, expect, describe } from "bun:test"
import {
  joseAlgorithms,
  jweContentEncryptionAlgorithms,
  jweKeyManagementAlgorithms,
  joseCompressionAlgorithms
} from "../src/constants/algorithms"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"

const namespaces = {
  valibot,
  zod
}

describe("jwa", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("JoseAlgorithmSchema", () => {
      test("valid signature algorithms", () => {
        for (const alg of joseAlgorithms) {
          expect(alg).toMatchSchema(schemas.JoseAlgorithmSchema)
        }
      })

      test("invalid algorithms", () => {
        const invalidAlgorithms = [
          "INVALID",
          "HS128", // Invalid key size
          "HS512K", // Invalid variant
          "RS128", // Invalid key size
          "PS128", // Invalid key size
          "ES128", // Invalid curve
          "EdDSA25519", // Redundant, should be just EdDSA
          "HMAC-SHA256", // Different naming convention
          "RSA-PSS", // Different naming convention
          "ECDSA-P256", // Different naming convention
          "",
          "none-insecure" // Invalid variant
        ]

        for (const alg of invalidAlgorithms) {
          expect(alg).not.toMatchSchema(schemas.JoseAlgorithmSchema)
        }
      })
    })

    describe("JweContentEncryptionAlgorithmSchema", () => {
      test("valid algorithms", () => {
        for (const alg of jweContentEncryptionAlgorithms) {
          expect(alg).toMatchSchema(schemas.JweContentEncryptionAlgorithmSchema)
        }
      })

      test("invalid algorithms", () => {
        const invalidAlgorithms = [
          "A64GCM", // Invalid key size
          "A512GCM", // Invalid key size
          "A128CBC", // Missing HMAC
          "A256ECB", // ECB not secure
          "ChaCha20-Poly1305", // Not in JWE spec
          "HS256", // Signature algorithm
          ""
        ]

        for (const alg of invalidAlgorithms) {
          expect(alg).not.toMatchSchema(
            schemas.JweContentEncryptionAlgorithmSchema
          )
        }
      })
    })

    describe("JweKeyManagementAlgorithmSchema", () => {
      test("valid algorithms", () => {
        for (const alg of jweKeyManagementAlgorithms) {
          expect(alg).toMatchSchema(schemas.JweKeyManagementAlgorithmSchema)
        }
      })

      test("invalid algorithms", () => {
        const invalidAlgorithms = [
          "A64KW", // Invalid key size
          "ECDH", // Missing variant
          "PBES2", // Missing hash and key wrap
          "HS256", // Signature algorithm
          ""
        ]

        for (const alg of invalidAlgorithms) {
          expect(alg).not.toMatchSchema(schemas.JweKeyManagementAlgorithmSchema)
        }
      })
    })

    describe("JoseCompressionAlgorithmSchema", () => {
      test("valid algorithms", () => {
        for (const alg of joseCompressionAlgorithms) {
          expect(alg).toMatchSchema(schemas.JoseCompressionAlgorithmSchema)
        }
      })

      test("invalid algorithms", () => {
        const invalidAlgorithms = [
          "gzip", // Different compression
          "bzip2", // Different compression
          "lz4", // Different compression
          "zstd", // Different compression
          "DEFLATE", // Wrong case
          ""
        ]

        for (const alg of invalidAlgorithms) {
          expect(alg).not.toMatchSchema(schemas.JoseCompressionAlgorithmSchema)
        }
      })
    })
  })
})
