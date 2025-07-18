import type { Base64, Base64Url } from "../shared/base-64"
import type {
  JweKeyManagementAlgorithm,
  JweContentEncryptionAlgorithm,
  JoseCompressionAlgorithm
} from "../shared/algorithms"
import type { JsonWebKey } from "./jwk"

/**
 * JWE Protected Header.
 * Contains algorithm and other cryptographic parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.1}
 */
export interface JweProtectedHeader {
  /** Algorithm used for key management */
  alg: JweKeyManagementAlgorithm

  /** Algorithm used for content encryption */
  enc: JweContentEncryptionAlgorithm

  /** Compression algorithm (optional) */
  zip?: JoseCompressionAlgorithm

  /** Key ID (optional) */
  kid?: string

  /** JSON Web Key Set URL (optional) */
  jku?: string

  /** JSON Web Key (optional) */
  jwk?: JsonWebKey

  /** X.509 URL (optional) */
  x5u?: string

  /** X.509 Certificate Chain (optional) */
  x5c?: Base64[]

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t?: Base64Url

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256"?: Base64Url

  /** Type of the token (optional) */
  typ?: string

  /** Content type (optional) */
  cty?: string

  /** Critical header parameter (optional) */
  crit?: string[]
}

/**
 * JWE Unprotected Header.
 * Contains additional header parameters that are not encrypted.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.2}
 */
export interface JweUnprotectedHeader {
  /** Key ID (optional) */
  kid?: string

  /** JSON Web Key Set URL (optional) */
  jku?: string

  /** JSON Web Key (optional) */
  jwk?: JsonWebKey

  /** X.509 URL (optional) */
  x5u?: string

  /** X.509 Certificate Chain (optional) */
  x5c?: Base64[]

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t?: Base64Url

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256"?: Base64Url

  /** Critical header parameter (optional) */
  crit?: string[]
}

/**
 * JWE recipient information.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.1}
 */
export interface JweRecipient {
  /** Unprotected header for this recipient */
  header?: JweUnprotectedHeader

  /** Encrypted key for this recipient (base64url-encoded) */
  encrypted_key: Base64Url
}

/**
 * JWE General JSON Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.1}
 */
export interface JweGeneralJson {
  /** Protected header (base64url-encoded) */
  protected?: Base64Url

  /** Unprotected header */
  unprotected?: JweUnprotectedHeader

  /** Array of recipients */
  recipients: JweRecipient[]

  /** Initialization vector (base64url-encoded) */
  iv: Base64Url

  /** Ciphertext (base64url-encoded) */
  ciphertext: Base64Url

  /** Authentication tag (base64url-encoded) */
  tag: Base64Url

  /** Additional authenticated data (base64url-encoded, optional) */
  aad?: Base64Url
}

/**
 * JWE Flattened JSON Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.2}
 */
export interface JweFlattenedJson {
  /** Protected header (base64url-encoded) */
  protected?: Base64Url

  /** Unprotected header */
  unprotected?: JweUnprotectedHeader

  /** Recipient header */
  header?: JweUnprotectedHeader

  /** Encrypted key (base64url-encoded) */
  encrypted_key: Base64Url

  /** Initialization vector (base64url-encoded) */
  iv: Base64Url

  /** Ciphertext (base64url-encoded) */
  ciphertext: Base64Url

  /** Authentication tag (base64url-encoded) */
  tag: Base64Url

  /** Additional authenticated data (base64url-encoded, optional) */
  aad?: Base64Url
}

/**
 * JWE Compact Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export type JweCompact = string

/**
 * JWE - union of all serialization formats.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516}
 */
export type Jwe = JweCompact | JweFlattenedJson | JweGeneralJson
