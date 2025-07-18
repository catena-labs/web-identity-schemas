import * as v from "valibot"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
import { JoseAlgorithmSchema } from "./jwa"
import { EllipticCurveSchema, OctetKeyPairCurveSchema } from "../shared/curves"
import { keyUses, keyOperations } from "../../constants/jwk"
import type { Shape } from "../shared/shape"
import type {
  KeyUse,
  KeyOperation,
  BaseJwk,
  RsaJwk,
  EcJwk,
  OctJwk,
  OkpJwk,
  JsonWebKey
} from "../../types/jose/jwk"

/**
 * Intended key use.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.2}
 *
 * @example
 * "sig" // For signature operations
 * "enc" // For encryption operations
 */
export const KeyUseSchema = v.pipe(
  v.picklist(keyUses),
  v.custom<KeyUse>(() => true)
)

/**
 * Allowed key operations.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 *
 * @example
 * "sign" // Compute digital signature or MAC
 * "verify" // Verify digital signature or MAC
 */
export const KeyOperationSchema = v.pipe(
  v.picklist(keyOperations),
  v.custom<KeyOperation>(() => true)
)

/**
 * Allowed key operations.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 *
 * @example
 * ["sign", "verify"] // Key can sign and verify
 */
export const KeyOpsSchema = v.array(KeyOperationSchema)

/**
 * Base JWK schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517}
 */
export const BaseJwkSchema = v.object({
  /** Algorithm intended for use with the key (e.g., "RS256") */
  alg: v.optional(JoseAlgorithmSchema),

  /** Whether the key is extractable (for Web Crypto API) */
  ext: v.optional(v.boolean()),

  /** Key operations permitted (e.g., ["sign", "verify"]) */
  key_ops: v.optional(KeyOpsSchema),

  /** Key ID (identifier for key) */
  kid: v.optional(v.string()),

  /** Intended key use ("sig" for signature, "enc" for encryption) */
  use: v.optional(KeyUseSchema),

  /** X.509 certificate chain (base64, not base64url) */
  x5c: v.optional(v.array(Base64Schema)),

  /** X.509 certificate SHA-1 thumbprint (base64url-encoded) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 certificate SHA-256 thumbprint (base64url-encoded) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** URL pointing to X.509 certificate */
  x5u: v.optional(v.pipe(v.string(), v.url()))
} satisfies Shape<BaseJwk>)

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
export const RsaJwkSchema = v.object({
  ...BaseJwkSchema.entries,

  /** Key type: RSA */
  kty: v.literal("RSA"),

  /** RSA modulus (base64url-encoded) */
  n: Base64UrlSchema,

  /** RSA public exponent (base64url-encoded) */
  e: Base64UrlSchema,

  /** RSA private exponent (base64url-encoded) */
  d: v.optional(Base64UrlSchema),

  /** First prime factor (base64url-encoded) */
  p: v.optional(Base64UrlSchema),

  /** Second prime factor (base64url-encoded) */
  q: v.optional(Base64UrlSchema),

  /** First CRT exponent (base64url-encoded) */
  dp: v.optional(Base64UrlSchema),

  /** Second CRT exponent (base64url-encoded) */
  dq: v.optional(Base64UrlSchema),

  /** First CRT coefficient (base64url-encoded) */
  qi: v.optional(Base64UrlSchema),

  /** Other primes info for multi-prime RSA */
  oth: v.optional(
    v.array(
      v.object({
        /** Additional prime factor (base64url-encoded) */
        r: Base64UrlSchema,

        /** Additional factor CRT exponent (base64url-encoded) */
        d: Base64UrlSchema,

        /** Additional factor CRT coefficient (base64url-encoded) */
        t: v.optional(Base64UrlSchema)
      })
    )
  )
} satisfies Shape<RsaJwk>)

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
export const EcJwkSchema = v.object({
  ...BaseJwkSchema.entries,

  /** Key type: Elliptic Curve */
  kty: v.literal("EC"),

  /** Curve name (e.g., "P-256", "P-384", "P-521", "secp256k1") */
  crv: EllipticCurveSchema,

  /** X coordinate of EC public key (base64url-encoded) */
  x: Base64UrlSchema,

  /** Y coordinate of EC public key (base64url-encoded) */
  y: Base64UrlSchema,

  /** EC private key (base64url-encoded) */
  d: v.optional(Base64UrlSchema)
} satisfies Shape<EcJwk>)

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
export const OctJwkSchema = v.object({
  ...BaseJwkSchema.entries,

  /** Key type: symmetric (octet sequence) */
  kty: v.literal("oct"),

  /** Symmetric key material (base64url-encoded) */
  k: Base64UrlSchema
} satisfies Shape<OctJwk>)

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
export const OkpJwkSchema = v.object({
  ...BaseJwkSchema.entries,

  /** Key type: Octet Key Pair */
  kty: v.literal("OKP"),

  /** Curve name (e.g., "Ed25519", "X25519") */
  crv: OctetKeyPairCurveSchema,

  /** Public key (base64url-encoded) */
  x: Base64UrlSchema,

  /** Private key (base64url-encoded) */
  d: v.optional(Base64UrlSchema)
} satisfies Shape<OkpJwk>)

/**
 * Discriminated union of all supported JWK types based on kty.
 *
 * @example
 * { "kty": "RSA", "n": "...", "e": "AQAB" } // RSA key
 * { "kty": "EC", "crv": "P-256", "x": "...", "y": "..." } // EC key
 */
export const JsonWebKeySchema = v.pipe(
  v.variant("kty", [RsaJwkSchema, EcJwkSchema, OctJwkSchema, OkpJwkSchema]),
  v.custom<JsonWebKey>(() => true)
)
