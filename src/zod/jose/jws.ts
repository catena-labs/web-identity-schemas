import type {
  JwsProtectedHeader,
  JwsUnprotectedHeader,
  JwsSignature,
  JwsFlattenedJson,
  JwsGeneralJson,
  JwsString
} from "../../types/jose/jws"
import type { Shape } from "../shared/shape"
import * as z from "zod"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
import { JoseAlgorithmSchema } from "./jwa"
import { JsonWebKeySchema } from "./jwk"

/**
 * JWS Protected Header Schema.
 * Contains algorithm and other cryptographic parameters for JWS.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1}
 */
export const JwsProtectedHeaderSchema: Shape<JwsProtectedHeader> = z.object({
  /** Algorithm used to sign the JWS */
  alg: JoseAlgorithmSchema,

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
  crit: z.array(z.string()).optional()
})

/**
 * JWS Unprotected Header Schema.
 * Contains unprotected header parameters for JWS.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.2}
 */
export const JwsUnprotectedHeaderSchema: Shape<JwsUnprotectedHeader> = z.object(
  {
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
  }
)

/**
 * JWS Signature Schema.
 * Represents a single signature in JWS JSON serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2}
 */
export const JwsSignatureSchema: Shape<JwsSignature> = z.object({
  /** JWS Protected Header (base64url encoded, optional) */
  protected: Base64UrlSchema.optional(),

  /** JWS Unprotected Header (optional) */
  header: JwsUnprotectedHeaderSchema.optional(),

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * JWS Compact Serialization Schema.
 * Represents JWS in compact serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsCompactSerializationSchema = z.object({
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
export const JwsJsonSerializationSchema: Shape<JwsGeneralJson> = z.object({
  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Signatures */
  signatures: z.array(JwsSignatureSchema)
})

/**
 * JWS Flattened JSON Serialization Schema.
 * Represents JWS in flattened JSON serialization format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.2}
 */
export const JwsFlattenedJsonSerializationSchema: Shape<JwsFlattenedJson> =
  z.object({
    /** JWS Payload (base64url encoded) */
    payload: Base64UrlSchema,

    /** JWS Protected Header (base64url encoded, optional) */
    protected: Base64UrlSchema.optional(),

    /** JWS Unprotected Header (optional) */
    header: JwsUnprotectedHeaderSchema.optional(),

    /** JWS Signature (base64url encoded) */
    signature: Base64UrlSchema
  })

/**
 * JWS String Format Schema.
 * Validates JWS compact serialization string format.
 * Must contain exactly 3 parts separated by periods.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsStringSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]+$/)
  .pipe(z.custom<JwsString>())

/**
 * JWS Parsed Schema.
 * Validates JWS format and transforms it into component parts.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsParsedSchema = JwsStringSchema.transform((jws) => {
  const parts = jws.split(".")
  return {
    protected: parts[0],
    payload: parts[1],
    signature: parts[2]
  }
})

/**
 * Detached JWS String Format Schema.
 * Validates detached JWS format with empty payload (header..signature).
 * Used in JsonWebSignature2020 proofs for Verifiable Credentials.
 * @see {@link https://w3c.github.io/vc-jws-2020/} and RFC7797
 */
export const DetachedJwsStringSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+\.\.[A-Za-z0-9_-]+$/)

/**
 * JWS Object Schema.
 * Represents a parsed JWS with its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-3}
 */
export const JwsObjectSchema = z.object({
  /** JWS Protected Header containing signature parameters */
  protected: JwsProtectedHeaderSchema,

  /** JWS Unprotected Header (optional) */
  unprotected: JwsUnprotectedHeaderSchema.optional(),

  /** JWS Payload (base64url encoded) */
  payload: Base64UrlSchema,

  /** JWS Signature (base64url encoded) */
  signature: Base64UrlSchema
})
