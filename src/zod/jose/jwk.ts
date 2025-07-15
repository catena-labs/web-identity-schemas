import * as z from "zod"
import { Base64UrlSchema } from "../shared/base-64-url"
import { JoseAlgorithmSchema } from "./jwa"
import { EllipticCurveSchema, OctetKeyPairCurveSchema } from "../shared/curves"
import { keyUses, keyOperations } from "../../constants/jwk"
import type { Shape } from "../shared/shape"
import type { KeyUse, KeyOperation, JsonWebKey } from "../../types/jose/jwk"

/**
 * Intended key use.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.2}
 *
 * @example
 * "sig" // For signature operations
 * "enc" // For encryption operations
 */
export const KeyUseSchema = z.enum(keyUses).pipe(z.custom<KeyUse>())

/**
 * Allowed key operations.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 *
 * @example
 * "sign" // Compute digital signature or MAC
 * "verify" // Verify digital signature or MAC
 */
export const KeyOperationSchema = z
  .enum(keyOperations)
  .pipe(z.custom<KeyOperation>())

/**
 * Allowed key operations.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 *
 * @example
 * ["sign", "verify"] // Key can sign and verify
 */
export const KeyOpsSchema = z.array(KeyOperationSchema)

/**
 * Base JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517}
 */
export const BaseJwkSchema = z.object({
  /** Algorithm intended for use with the key (e.g., "RS256") */
  alg: JoseAlgorithmSchema.optional(),

  /** Whether the key is extractable (for Web Crypto API) */
  ext: z.boolean().optional(),

  /** Key operations permitted (e.g., ["sign", "verify"]) */
  key_ops: KeyOpsSchema.optional(),

  /** Key ID (identifier for key) */
  kid: z.string().optional(),

  /** Intended key use ("sig" for signature, "enc" for encryption) */
  use: KeyUseSchema.optional(),

  /** X.509 certificate chain (base64url-encoded certs) */
  x5c: z.array(z.string()).optional(),

  /** X.509 certificate SHA-1 thumbprint (base64url-encoded) */
  x5t: z.string().optional(),

  /** X.509 certificate SHA-256 thumbprint (base64url-encoded) */
  "x5t#S256": z.string().optional(),

  /** URL pointing to X.509 certificate */
  x5u: z.url().optional()
})

/**
 * RSA JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.3}
 *
 * @example
 * {
 *   "kty": "RSA",
 *   "n": "0vx7agoebGcQSuuPiLJX...",
 *   "e": "AQAB"
 * }
 */
export const RsaJwkSchema = z.object({
  ...BaseJwkSchema.shape,

  /** Key type: RSA */
  kty: z.literal("RSA"),

  /** RSA modulus (base64url-encoded) */
  n: Base64UrlSchema,

  /** RSA public exponent (base64url-encoded) */
  e: Base64UrlSchema,

  /** RSA private exponent (base64url-encoded) */
  d: Base64UrlSchema.optional(),

  /** First prime factor (base64url-encoded) */
  p: Base64UrlSchema.optional(),

  /** Second prime factor (base64url-encoded) */
  q: Base64UrlSchema.optional(),

  /** First CRT exponent (base64url-encoded) */
  dp: Base64UrlSchema.optional(),

  /** Second CRT exponent (base64url-encoded) */
  dq: Base64UrlSchema.optional(),

  /** First CRT coefficient (base64url-encoded) */
  qi: Base64UrlSchema.optional(),

  /** Other primes info for multi-prime RSA */
  oth: z
    .array(
      z.object({
        /** Additional prime factor (base64url-encoded) */
        r: Base64UrlSchema,

        /** Additional factor CRT exponent (base64url-encoded) */
        d: Base64UrlSchema,

        /** Additional factor CRT coefficient (base64url-encoded) */
        t: Base64UrlSchema.optional()
      })
    )
    .optional()
})

/**
 * EC JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.2}
 *
 * @example
 * {
 *   "kty": "EC",
 *   "crv": "P-256",
 *   "x": "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGHwHitJBcBmg",
 *   "y": "y77As5vbZx-oJcJLaVVLQPuHDMGLXA4VgQ6k2Ee9Uuk"
 * }
 */
export const EcJwkSchema = z.object({
  ...BaseJwkSchema.shape,

  /** Key type: Elliptic Curve */
  kty: z.literal("EC"),

  /** Curve name (e.g., "P-256", "P-384", "P-521", "secp256k1") */
  crv: EllipticCurveSchema,

  /** X coordinate of EC public key (base64url-encoded) */
  x: Base64UrlSchema,

  /** Y coordinate of EC public key (base64url-encoded) */
  y: Base64UrlSchema,

  /** EC private key (base64url-encoded) */
  d: Base64UrlSchema.optional()
})

/**
 * Symmetric (octet) JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.4}
 *
 * @example
 * {
 *   "kty": "oct",
 *   "k": "AyM1SysPpbyDfgZld3umj1qzKObwVMkoqQ-EstJQLr_T-1qS0gZH75aKtMN3Yj0iPS4hcgUuTwjAzZr1Z9CAow"
 * }
 */
export const OctJwkSchema = z.object({
  ...BaseJwkSchema.shape,

  /** Key type: symmetric (octet sequence) */
  kty: z.literal("oct"),

  /** Symmetric key material (base64url-encoded) */
  k: Base64UrlSchema
})

/**
 * OKP JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037}
 *
 * @example
 * {
 *   "kty": "OKP",
 *   "crv": "Ed25519",
 *   "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"
 * }
 */
export const OkpJwkSchema = BaseJwkSchema.extend({
  /** Key type: Octet Key Pair */
  kty: z.literal("OKP"),

  /** Curve name (e.g., "Ed25519", "X25519") */
  crv: OctetKeyPairCurveSchema,

  /** Public key (base64url-encoded) */
  x: Base64UrlSchema,

  /** Private key (base64url-encoded) */
  d: Base64UrlSchema.optional()
})

/**
 * Discriminated union of all supported JWK types based on kty.
 *
 * @example
 * { "kty": "RSA", "n": "...", "e": "AQAB" } // RSA key
 * { "kty": "EC", "crv": "P-256", "x": "...", "y": "..." } // EC key
 */
export const JsonWebKeySchema: Shape<JsonWebKey> = z.discriminatedUnion("kty", [
  RsaJwkSchema,
  EcJwkSchema,
  OctJwkSchema,
  OkpJwkSchema
])
