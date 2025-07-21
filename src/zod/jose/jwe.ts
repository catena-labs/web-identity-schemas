import type {
  JweProtectedHeader,
  JweUnprotectedHeader,
  JweRecipient,
  JweFlattenedJson,
  JweGeneralJson
} from "../../types/jose/jwe"
import type { Shape } from "../shared/shape"
import * as z from "zod"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
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
const JweProtectedHeaderSchema: Shape<JweProtectedHeader> = z.object({
  /** Algorithm used for key management */
  alg: JweKeyManagementAlgorithmSchema,

  /** Algorithm used for content encryption */
  enc: JweContentEncryptionAlgorithmSchema,

  /** Compression algorithm (optional) */
  zip: JoseCompressionAlgorithmSchema.optional(),

  /** Key ID (optional) */
  kid: z.string().optional(),

  /** JSON Web Key Set URL (optional) */
  jku: z.url().optional(),

  /** JSON Web Key (optional) */
  jwk: JsonWebKeySchema.optional(),

  /** X.509 URL (optional) */
  x5u: z.url().optional(),

  /** X.509 Certificate Chain (optional) (base64, not base64url) */
  x5c: z.array(Base64Schema).optional(),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: Base64UrlSchema.optional(),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": Base64UrlSchema.optional(),

  /** Type of the token (optional) */
  typ: z.string().optional(),

  /** Content type (optional) */
  cty: z.string().optional(),

  /** Critical header parameter (optional) */
  crit: z.array(z.string()).optional(),

  /** Ephemeral public key (optional, for ECDH-ES) */
  epk: JsonWebKeySchema.optional(),

  /** Agreement PartyUInfo (optional, for ECDH-ES) */
  apu: Base64UrlSchema.optional(),

  /** Agreement PartyVInfo (optional, for ECDH-ES) */
  apv: Base64UrlSchema.optional(),

  /** Initialization Vector (optional, for AES GCM) */
  iv: Base64UrlSchema.optional(),

  /** Authentication Tag (optional, for AES GCM) */
  tag: Base64UrlSchema.optional(),

  /** PBES2 Salt Input (optional, for PBES2) */
  p2s: Base64UrlSchema.optional(),

  /** PBES2 Count (optional, for PBES2) */
  p2c: z.number().int().min(1).optional()
})

/**
 * JWE Unprotected Header Schema.
 * Contains unprotected header parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.2}
 */
const JweUnprotectedHeaderSchema: Shape<JweUnprotectedHeader> = z.object({
  /** Key ID (optional) */
  kid: z.string().optional(),

  /** JSON Web Key Set URL (optional) */
  jku: z.url().optional(),

  /** JSON Web Key (optional) */
  jwk: JsonWebKeySchema.optional(),

  /** X.509 URL (optional) */
  x5u: z.url().optional(),

  /** X.509 Certificate Chain (optional) (base64, not base64url) */
  x5c: z.array(Base64Schema).optional(),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: Base64UrlSchema.optional(),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": Base64UrlSchema.optional(),

  /** Critical header parameter (optional) */
  crit: z.array(z.string()).optional()
})

/**
 * JWE Per-Recipient Unprotected Header Schema.
 * Contains per-recipient unprotected header parameters for JWE.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-4.1.3}
 */
const JwePerRecipientUnprotectedHeaderSchema: Shape<JweUnprotectedHeader> =
  z.object({
    /** Algorithm used for key management for this recipient */
    alg: JweKeyManagementAlgorithmSchema.optional(),

    /** Key ID (optional) */
    kid: z.string().optional(),

    /** JSON Web Key Set URL (optional) */
    jku: z.url().optional(),

    /** JSON Web Key (optional) */
    jwk: JsonWebKeySchema.optional(),

    /** X.509 URL (optional) */
    x5u: z.url().optional(),

    /** X.509 Certificate Chain (optional) (base64, not base64url) */
    x5c: z.array(Base64Schema).optional(),

    /** X.509 Certificate SHA-1 Thumbprint (optional) */
    x5t: Base64UrlSchema.optional(),

    /** X.509 Certificate SHA-256 Thumbprint (optional) */
    "x5t#S256": Base64UrlSchema.optional(),

    /** Critical header parameter (optional) */
    crit: z.array(z.string()).optional()
  })

/**
 * JWE Recipient Schema.
 * Represents a single recipient in JWE JSON serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2}
 */
const JweRecipientSchema: Shape<JweRecipient> = z.object({
  /** Per-recipient unprotected header (optional) */
  header: JwePerRecipientUnprotectedHeaderSchema.optional(),

  /** Encrypted key for this recipient (base64url encoded) */
  encrypted_key: Base64UrlSchema
})

/**
 * JWE Compact Serialization Schema.
 * Represents JWE in compact serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export const JweCompactSerializationSchema = z.object({
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
export const JweJsonSerializationSchema: Shape<JweGeneralJson> = z.object({
  /** JWE Protected Header (base64url encoded, optional) */
  protected: Base64UrlSchema.optional(),

  /** JWE Unprotected Header (optional) */
  unprotected: JweUnprotectedHeaderSchema.optional(),

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema,

  /** JWE Additional Authenticated Data (base64url encoded, optional) */
  aad: Base64UrlSchema.optional(),

  /** JWE Recipients */
  recipients: z.array(JweRecipientSchema)
})

/**
 * JWE Flattened JSON Serialization Schema.
 * Represents JWE in flattened JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.2.2}
 */
export const JweFlattenedJsonSerializationSchema: Shape<JweFlattenedJson> =
  z.object({
    /** JWE Protected Header (base64url encoded, optional) */
    protected: Base64UrlSchema.optional(),

    /** JWE Unprotected Header (optional) */
    unprotected: JweUnprotectedHeaderSchema.optional(),

    /** JWE Per-Recipient Unprotected Header (optional) */
    header: JwePerRecipientUnprotectedHeaderSchema.optional(),

    /** JWE Encrypted Key (base64url encoded) */
    encrypted_key: Base64UrlSchema,

    /** JWE Initialization Vector (base64url encoded) */
    iv: Base64UrlSchema,

    /** JWE Ciphertext (base64url encoded) */
    ciphertext: Base64UrlSchema,

    /** JWE Authentication Tag (base64url encoded) */
    tag: Base64UrlSchema,

    /** JWE Additional Authenticated Data (base64url encoded, optional) */
    aad: Base64UrlSchema.optional()
  })

/**
 * JWE String Format Schema.
 * Validates JWE compact serialization string format.
 * Must contain exactly 5 parts separated by periods.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-7.1}
 */
export const JweStringSchema = z
  .string()
  .regex(
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/
  )
  .transform((jwe) => {
    const parts = jwe.split(".")
    return {
      protected: parts[0],
      encrypted_key: parts[1],
      iv: parts[2],
      ciphertext: parts[3],
      tag: parts[4]
    }
  })

/**
 * JWE Object Schema.
 * Represents a parsed JWE with its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7516#section-3}
 */
export const JweObjectSchema = z.object({
  /** JWE Protected Header containing encryption parameters */
  protected: JweProtectedHeaderSchema,

  /** JWE Unprotected Header (optional) */
  unprotected: JweUnprotectedHeaderSchema.optional(),

  /** JWE Encrypted Key (base64url encoded) */
  encrypted_key: Base64UrlSchema,

  /** JWE Initialization Vector (base64url encoded) */
  iv: Base64UrlSchema,

  /** JWE Ciphertext (base64url encoded) */
  ciphertext: Base64UrlSchema,

  /** JWE Authentication Tag (base64url encoded) */
  tag: Base64UrlSchema
})
