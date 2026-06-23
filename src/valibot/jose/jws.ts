/**
 * JWS schemas validate structure only — they do not verify signatures.
 *
 * An empty signature is accepted because it is the shape of an unsecured JWS
 * (`alg: "none"`, RFC 7515 Appendix A.5). Because the protected header is an
 * opaque base64url string at this layer, the schemas do not cross-check that an
 * empty signature implies `alg: "none"` (nor that a present signature is
 * cryptographically valid). Verifying signature presence/authenticity and
 * rejecting `alg: "none"` downgrade attacks is the caller's responsibility.
 */
import * as v from "valibot"

import type {
  JwsProtectedHeader,
  JwsUnprotectedHeader,
  JwsSignature,
  JwsGeneralJson,
  JwsFlattenedJson,
  JwsString,
} from "../../types/jose/jws"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
import type { Shape } from "../shared/shape"
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
  crit: v.optional(v.array(v.string())),
} satisfies Shape<JwsProtectedHeader>)

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
  crit: v.optional(v.array(v.string())),
} satisfies Shape<JwsUnprotectedHeader>)

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

  /** JWS Signature (base64url encoded, empty for unsecured JWS) */
  signature: v.union([Base64UrlSchema, v.literal("")]),
} satisfies Shape<JwsSignature>)

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

  /** JWS Signature (base64url encoded, empty for unsecured JWS) */
  signature: v.union([Base64UrlSchema, v.literal("")]),
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
  signatures: v.array(JwsSignatureSchema),
} satisfies Shape<JwsGeneralJson>)

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

  /** JWS Signature (base64url encoded, empty for unsecured JWS) */
  signature: v.union([Base64UrlSchema, v.literal("")]),
} satisfies Shape<JwsFlattenedJson>)

/**
 * JWS String Format Schema.
 * Validates JWS compact serialization string format (header.payload.signature).
 * The signature part may be empty for unsecured JWS (alg: "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsStringSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/),
  v.custom<JwsString>(() => true),
)

/**
 * JWS Parsed Schema.
 * Validates JWS format and transforms it into component parts.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export const JwsParsedSchema = v.pipe(
  JwsStringSchema,
  v.transform((jws) => {
    const [protectedHeader, payload, signature] = jws.split(".")
    if (!protectedHeader || !payload) {
      throw new Error("Invalid JWS string")
    }
    return {
      protected: protectedHeader,
      payload,
      signature: signature ?? "",
    }
  }),
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

  /** JWS Signature (base64url encoded, empty for unsecured JWS) */
  signature: v.union([Base64UrlSchema, v.literal("")]),
})

/**
 * Detached JWS String Format Schema.
 * Validates detached JWS format with empty payload (header..signature).
 * Used in JsonWebSignature2020 proofs for Verifiable Credentials.
 * @see {@link https://w3c.github.io/vc-jws-2020/} and RFC7797
 */
export const DetachedJwsStringSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+\.\.[A-Za-z0-9_-]+$/),
  v.custom<JwsString>(() => true),
)
