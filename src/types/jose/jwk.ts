import type { Base64, Base64Url } from "../shared/base-64"
import type { EllipticCurve, OctetKeyPairCurve } from "../shared/curves"
import type { JoseAlgorithm } from "../shared/algorithms"

/**
 * Intended key use.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.2}
 */
export type KeyUse = "sig" | "enc"

/**
 * Allowed key operations.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 */
export type KeyOperation =
  | "sign" // Compute digital signature or MAC
  | "verify" // Verify digital signature or MAC
  | "encrypt" // Encrypt content
  | "decrypt" // Decrypt content and validate decryption, if applicable
  | "wrapKey" // Encrypt key
  | "unwrapKey" // Decrypt key and validate decryption, if applicable
  | "deriveKey" // Derive key
  | "deriveBits" // Derive bits not to be used as a key

/**
 * Base JWK interface with common fields.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517}
 */
export interface BaseJwk {
  /** Algorithm intended for use with the key (e.g., "RS256") */
  alg?: JoseAlgorithm

  /** Whether the key is extractable (for Web Crypto API) */
  ext?: boolean

  /** Key operations permitted (e.g., ["sign", "verify"]) */
  key_ops?: KeyOperation[]

  /** Key ID (identifier for key) */
  kid?: string

  /** Intended key use ("sig" for signature, "enc" for encryption) */
  use?: KeyUse

  /**
   * X.509 certificate chain (base64-encoded certs - explicitly NOT base64url)
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.6}
   */
  x5c?: Base64[]

  /** X.509 certificate SHA-1 thumbprint (base64url-encoded) */
  x5t?: Base64Url

  /** X.509 certificate SHA-256 thumbprint (base64url-encoded) */
  "x5t#S256"?: Base64Url

  /** URL pointing to X.509 certificate */
  x5u?: string
}

/**
 * RSA JWK.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.3}
 */
export interface RsaJwk extends BaseJwk {
  /** Key type: RSA */
  kty: "RSA"

  /** RSA modulus (base64url-encoded) */
  n: Base64Url

  /** RSA public exponent (base64url-encoded) */
  e: Base64Url

  /** RSA private exponent (base64url-encoded) */
  d?: Base64Url

  /** First prime factor (base64url-encoded) */
  p?: Base64Url

  /** Second prime factor (base64url-encoded) */
  q?: Base64Url

  /** First CRT exponent (base64url-encoded) */
  dp?: Base64Url

  /** Second CRT exponent (base64url-encoded) */
  dq?: Base64Url

  /** First CRT coefficient (base64url-encoded) */
  qi?: Base64Url

  /** Other primes info for multi-prime RSA */
  oth?: {
    /** Additional prime factor (base64url-encoded) */
    r: Base64Url

    /** Additional factor CRT exponent (base64url-encoded) */
    d: Base64Url

    /** Additional factor CRT coefficient (base64url-encoded) */
    t?: Base64Url
  }[]
}

/**
 * EC JWK.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.2}
 */
export interface EcJwk extends BaseJwk {
  /** Key type: Elliptic Curve */
  kty: "EC"

  /** Curve name (e.g., "P-256", "P-384", "P-521", "secp256k1") */
  crv: EllipticCurve

  /** X coordinate of EC public key (base64url-encoded) */
  x: Base64Url

  /** Y coordinate of EC public key (base64url-encoded) */
  y: Base64Url

  /** EC private key (base64url-encoded) */
  d?: Base64Url
}

/**
 * Symmetric (octet) JWK.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.4}
 */
export interface OctJwk extends BaseJwk {
  /** Key type: symmetric (octet sequence) */
  kty: "oct"

  /** Symmetric key material (base64url-encoded) */
  k: Base64Url
}

/**
 * OKP JWK.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037}
 */
export interface OkpJwk extends BaseJwk {
  /** Key type: Octet Key Pair */
  kty: "OKP"

  /** Curve name (e.g., "Ed25519", "X25519") */
  crv: OctetKeyPairCurve

  /** Public key (base64url-encoded) */
  x: Base64Url

  /** Private key (base64url-encoded) */
  d?: Base64Url
}

/**
 * JSON Web Key - union of all supported key types.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517}
 */
export type JsonWebKey = RsaJwk | EcJwk | OctJwk | OkpJwk
