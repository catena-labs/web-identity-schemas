import type {
  JweKeyManagementAlgorithm,
  JweContentEncryptionAlgorithm,
  JoseCompressionAlgorithm,
} from "../shared/algorithms"
import type { Base64, Base64Url } from "../shared/base-64"
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

  /** Ephemeral public key (optional, for ECDH-ES) */
  epk?: JsonWebKey

  /** Agreement PartyUInfo (optional, for ECDH-ES) */
  apu?: Base64Url

  /** Agreement PartyVInfo (optional, for ECDH-ES) */
  apv?: Base64Url

  /** Initialization Vector (optional, for AES GCM key wrapping) */
  iv?: Base64Url

  /** Authentication Tag (optional, for AES GCM key wrapping) */
  tag?: Base64Url

  /** PBES2 Salt Input (optional, for PBES2) */
  p2s?: Base64Url

  /** PBES2 Count (optional, for PBES2) */
  p2c?: number
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

  /** Ephemeral public key (optional, for ECDH-ES) */
  epk?: JsonWebKey

  /** Agreement PartyUInfo (optional, for ECDH-ES) */
  apu?: Base64Url

  /** Agreement PartyVInfo (optional, for ECDH-ES) */
  apv?: Base64Url

  /** Initialization Vector (optional, for AES GCM key wrapping) */
  iv?: Base64Url

  /** Authentication Tag (optional, for AES GCM key wrapping) */
  tag?: Base64Url

  /** PBES2 Salt Input (optional, for PBES2) */
  p2s?: Base64Url

  /** PBES2 Count (optional, for PBES2) */
  p2c?: number
}

/**
 * JWE Per-Recipient Unprotected Header.
 * Like the unprotected header, but may also carry the key management algorithm
 * for the recipient.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.3}
 */
export interface JwePerRecipientUnprotectedHeader extends JweUnprotectedHeader {
  /** Algorithm used for key management for this recipient (optional) */
  alg?: JweKeyManagementAlgorithm
}

/**
 * JWE recipient information.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.1}
 */
export interface JweRecipient {
  /** Unprotected header for this recipient */
  header?: JwePerRecipientUnprotectedHeader

  /**
   * Encrypted key for this recipient (base64url-encoded).
   * Optional/absent when there is no encrypted key (e.g. "dir" or "ECDH-ES").
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.1}
   */
  encrypted_key?: Base64Url
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
  header?: JwePerRecipientUnprotectedHeader

  /**
   * Encrypted key (base64url-encoded).
   * Optional/absent when there is no encrypted key (e.g. "dir" or "ECDH-ES").
   * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.2}
   */
  encrypted_key?: Base64Url

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
 * JWE Compact Serialization (parsed object form).
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export interface JweCompactSerialization {
  /** Protected header (base64url-encoded) */
  protected: Base64Url

  /** Encrypted key (base64url-encoded, empty string for dir/ECDH-ES) */
  encrypted_key: Base64Url | ""

  /** Initialization vector (base64url-encoded) */
  iv: Base64Url

  /** Ciphertext (base64url-encoded) */
  ciphertext: Base64Url

  /** Authentication tag (base64url-encoded) */
  tag: Base64Url
}

/**
 * JWE parsed from compact string into base64url-encoded parts.
 * The encrypted key may be empty for direct key management (dir/ECDH-ES).
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export interface JweParsed {
  /** Protected header (base64url-encoded) */
  protected: Base64Url

  /** Encrypted key (base64url-encoded, empty for dir/ECDH-ES) */
  encrypted_key: Base64Url | ""

  /** Initialization vector (base64url-encoded) */
  iv: Base64Url

  /** Ciphertext (base64url-encoded) */
  ciphertext: Base64Url

  /** Authentication tag (base64url-encoded) */
  tag: Base64Url
}

/**
 * JWE object with decoded protected header.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-3}
 */
export interface JweObject {
  /** Decoded protected header */
  protected: JweProtectedHeader

  /** Unprotected header (optional) */
  unprotected?: JweUnprotectedHeader

  /** Encrypted key (base64url-encoded) */
  encrypted_key: Base64Url

  /** Initialization vector (base64url-encoded) */
  iv: Base64Url

  /** Ciphertext (base64url-encoded) */
  ciphertext: Base64Url

  /** Authentication tag (base64url-encoded) */
  tag: Base64Url
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
