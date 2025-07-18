import * as v from "valibot"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
import { JoseAlgorithmSchema } from "./jwa"
import { JsonWebKeySchema } from "./jwk"

/**
 * JWS Protected Header Schema.
 * Contains algorithm and other cryptographic parameters for JWS.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1}
 */
export const JwsProtectedHeaderSchema = v.object({
  /** Algorithm used to sign the JWS */
  alg: JoseAlgorithmSchema,

  /** Key ID (optional) */
  kid: v.optional(v.string()),

  /** JSON Web Key Set URL (optional) */
  jku: v.optional(v.pipe(v.string(), v.url())),

  /** JSON Web Key (optional) */
  jwk: v.optional(JsonWebKeySchema),

  /** X.509 URL (optional) */
  x5u: v.optional(v.pipe(v.string(), v.url())),

  /** X.509 Certificate Chain (optional) (base64, not base64url) */
  x5c: v.optional(v.array(Base64Schema)),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** Type of the token (optional) */
  typ: v.optional(v.string()),

  /** Content type (optional) */
  cty: v.optional(v.string()),

  /** Critical header parameter (optional) */
  crit: v.optional(v.array(v.string()))
})

/**
 * JWS Unprotected Header Schema.
 * Contains unprotected header parameters for JWS.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.2}
 */
export const JwsUnprotectedHeaderSchema = v.object({
  /** Key ID (optional) */
  kid: v.optional(v.string()),

  /** JSON Web Key Set URL (optional) */
  jku: v.optional(v.pipe(v.string(), v.url())),

  /** JSON Web Key (optional) */
  jwk: v.optional(JsonWebKeySchema),

  /** X.509 URL (optional) */
  x5u: v.optional(v.pipe(v.string(), v.url())),

  /** X.509 Certificate Chain (optional) (base64, not base64url) */
  x5c: v.optional(v.array(Base64Schema)),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: v.optional(Base64UrlSchema),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": v.optional(Base64UrlSchema),

  /** Critical header parameter (optional) */
  crit: v.optional(v.array(v.string()))
})

/**
 * JWS Signature Schema.
 * Represents a single signature in JWS JSON serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2}
 */
export const JwsSignatureSchema = v.object({
  /** JWS Protected Header (base64url encoded, optional) */
  protected: v.optional(Base64UrlSchema),

  /** JWS Unprotected Header (optional) */
  header: v.optional(JwsUnprotectedHeaderSchema),

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * JWS Compact Serialization Schema.
 * Represents JWS in compact serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
/**
 * JWS Compact Serialization Schema.
 * Represents JWS in compact serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsCompactSerializationSchema = v.object({
  /** JWS Protected Header (base64url encoded) */
  protected: Base64UrlSchema,

  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * JWS JSON Serialization Schema.
 * Represents JWS in JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2}
 */
export const JwsJsonSerializationSchema = v.object({
  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Signatures */
  signatures: v.array(JwsSignatureSchema)
})

/**
 * JWS Flattened JSON Serialization Schema.
 * Represents JWS in flattened JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.2}
 */
export const JwsFlattenedJsonSerializationSchema = v.object({
  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Protected Header (base64url encoded, optional) */
  protected: v.optional(Base64UrlSchema),

  /** JWS Unprotected Header (optional) */
  header: v.optional(JwsUnprotectedHeaderSchema),

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * JWS String Format Schema.
 * Validates JWS compact serialization string format.
 * Must contain exactly 3 parts separated by periods.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsStringSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+$/)
)

/**
 * JWS Parsed Schema.
 * Validates JWS format and transforms it into component parts.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsParsedSchema = v.pipe(
  JwsStringSchema,
  v.transform((jws) => {
    const parts = jws.split(".")
    return {
      protected: parts[0],
      payload: parts[1],
      signature: parts[2]
    }
  })
)

/**
 * JWS Object Schema.
 * Represents a parsed JWS with its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-3}
 */
export const JwsObjectSchema = v.object({
  /** JWS Protected Header containing signature parameters */
  protected: JwsProtectedHeaderSchema,

  /** JWS Unprotected Header (optional) */
  unprotected: v.optional(JwsUnprotectedHeaderSchema),

  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * Detached JWS String Format Schema.
 * Validates detached JWS format with empty payload (header..signature).
 * Used in JsonWebSignature2020 proofs for Verifiable Credentials.
 * @see {@link https://w3c.github.io/vc-jws-2020/} and RFC7797
 */
export const DetachedJwsStringSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+\.\.[A-Za-z0-9_-]+$/)
)
