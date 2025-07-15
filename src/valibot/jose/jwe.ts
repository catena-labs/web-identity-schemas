import * as v from "valibot"
import { Base64UrlSchema } from "../shared/base-64-url"
import {
  JweKeyManagementAlgorithmSchema,
  JweContentEncryptionAlgorithmSchema,
  JoseCompressionAlgorithmSchema
} from "./jwa"
import { JsonWebKeySchema } from "./jwk"

/**
 * JWE Protected Header Schema.
 * Contains algorithm and other cryptographic parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.1}
 */
const JweProtectedHeaderSchema = v.object({
  /** Algorithm used for key management */
  alg: JweKeyManagementAlgorithmSchema,

  /** Algorithm used for content encryption */
  enc: JweContentEncryptionAlgorithmSchema,

  /** Compression algorithm (optional) */
  zip: v.optional(JoseCompressionAlgorithmSchema),

  /** Key ID (optional) */
  kid: v.optional(v.string()),

  /** JSON Web Key Set URL (optional) */
  jku: v.optional(v.pipe(v.string(), v.url())),

  /** JSON Web Key (optional) */
  jwk: v.optional(JsonWebKeySchema),

  /** X.509 URL (optional) */
  x5u: v.optional(v.pipe(v.string(), v.url())),

  /** X.509 Certificate Chain (optional) */
  x5c: v.optional(v.array(v.string())),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** Type of the token (optional) */
  typ: v.optional(v.string()),

  /** Content type (optional) */
  cty: v.optional(v.string()),

  /** Critical header parameter (optional) */
  crit: v.optional(v.array(v.string())),

  /** Ephemeral public key (optional, for ECDH-ES) */
  epk: v.optional(JsonWebKeySchema),

  /** Agreement PartyUInfo (optional, for ECDH-ES) */
  apu: v.optional(Base64UrlSchema),

  /** Agreement PartyVInfo (optional, for ECDH-ES) */
  apv: v.optional(Base64UrlSchema),

  /** Initialization Vector (optional, for AES GCM) */
  iv: v.optional(Base64UrlSchema),

  /** Authentication Tag (optional, for AES GCM) */
  tag: v.optional(Base64UrlSchema),

  /** PBES2 Salt Input (optional, for PBES2) */
  p2s: v.optional(Base64UrlSchema),

  /** PBES2 Count (optional, for PBES2) */
  p2c: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)))
})

/**
 * JWE Unprotected Header Schema.
 * Contains unprotected header parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.2}
 */
const JweUnprotectedHeaderSchema = v.object({
  /** Key ID (optional) */
  kid: v.optional(v.string()),

  /** JSON Web Key Set URL (optional) */
  jku: v.optional(v.pipe(v.string(), v.url())),

  /** JSON Web Key (optional) */
  jwk: v.optional(JsonWebKeySchema),

  /** X.509 URL (optional) */
  x5u: v.optional(v.pipe(v.string(), v.url())),

  /** X.509 Certificate Chain (optional) */
  x5c: v.optional(v.array(v.string())),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** Critical header parameter (optional) */
  crit: v.optional(v.array(v.string()))
})

/**
 * JWE Per-Recipient Unprotected Header Schema.
 * Contains per-recipient unprotected header parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.3}
 */
const JwePerRecipientUnprotectedHeaderSchema = v.object({
  /** Algorithm used for key management for this recipient */
  alg: v.optional(JweKeyManagementAlgorithmSchema),

  /** Key ID (optional) */
  kid: v.optional(v.string()),

  /** JSON Web Key Set URL (optional) */
  jku: v.optional(v.pipe(v.string(), v.url())),

  /** JSON Web Key (optional) */
  jwk: v.optional(JsonWebKeySchema),

  /** X.509 URL (optional) */
  x5u: v.optional(v.pipe(v.string(), v.url())),

  /** X.509 Certificate Chain (optional) */
  x5c: v.optional(v.array(v.string())),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** Critical header parameter (optional) */
  crit: v.optional(v.array(v.string()))
})

/**
 * JWE Recipient Schema.
 * Represents a single recipient in JWE JSON serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2}
 */
const JweRecipientSchema = v.object({
  /** Per-recipient unprotected header (optional) */
  header: v.optional(JwePerRecipientUnprotectedHeaderSchema),

  /** Encrypted key for this recipient (base64url encoded) */
  encrypted_key: Base64UrlSchema
})

/**
 * JWE Compact Serialization Schema.
 * Represents JWE in compact serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export const JweCompactSerializationSchema = v.object({
  /** JWE Protected Header (base64url encoded) */
  protected: Base64UrlSchema,

  /** JWE Encrypted Key (base64url encoded) */
  encrypted_key: Base64UrlSchema,

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema
})

/**
 * JWE JSON Serialization Schema.
 * Represents JWE in JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2}
 */
export const JweJsonSerializationSchema = v.object({
  /** JWE Protected Header (base64url encoded, optional) */
  protected: v.optional(Base64UrlSchema),

  /** JWE Unprotected Header (optional) */
  unprotected: v.optional(JweUnprotectedHeaderSchema),

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema,

  /** JWE Additional Authenticated Data (base64url encoded, optional) */
  aad: v.optional(Base64UrlSchema),

  /** JWE Recipients */
  recipients: v.array(JweRecipientSchema)
})

/**
 * JWE Flattened JSON Serialization Schema.
 * Represents JWE in flattened JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.2}
 */
export const JweFlattenedJsonSerializationSchema = v.object({
  /** JWE Protected Header (base64url encoded, optional) */
  protected: v.optional(Base64UrlSchema),

  /** JWE Unprotected Header (optional) */
  unprotected: v.optional(JweUnprotectedHeaderSchema),

  /** JWE Per-Recipient Unprotected Header (optional) */
  header: v.optional(JwePerRecipientUnprotectedHeaderSchema),

  /** JWE Encrypted Key (base64url encoded) */
  encrypted_key: Base64UrlSchema,

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema,

  /** JWE Additional Authenticated Data (base64url encoded, optional) */
  aad: v.optional(Base64UrlSchema)
})

/**
 * JWE String Format Schema.
 * Validates JWE compact serialization string format.
 * Must contain exactly 5 parts separated by periods.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export const JweStringSchema = v.pipe(
  v.string(),
  v.regex(
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
  ),
  v.transform((jwe) => {
    const parts = jwe.split(".")
    return {
      protected: parts[0],
      encrypted_key: parts[1],
      iv: parts[2],
      ciphertext: parts[3],
      tag: parts[4]
    }
  })
)

/**
 * JWE Object Schema.
 * Represents a parsed JWE with its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-3}
 */
export const JweObjectSchema = v.object({
  /** JWE Protected Header containing encryption parameters */
  protected: JweProtectedHeaderSchema,

  /** JWE Unprotected Header (optional) */
  unprotected: v.optional(JweUnprotectedHeaderSchema),

  /** JWE Encrypted Key (base64url encoded) */
  encrypted_key: Base64UrlSchema,

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema
})
