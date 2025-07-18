import * as v from "valibot"
import { Base64Schema, Base64UrlSchema } from "../shared/base-64"
import {
  JoseSignatureAlgorithmSchema,
  JoseUnsecuredAlgorithmSchema
} from "./jwa"
import { JsonWebKeySchema } from "./jwk"

const UnixTimestampSchema = v.pipe(
  v.number(),
  v.integer("Unix timestamp must be an integer"),
  v.minValue(0, "Unix timestamp must be non-negative")
)

/**
 * Common JWT header fields for all algorithms.
 * Contains cryptographic parameters excluding the algorithm.
 */
const JwtHeaderBaseSchema = v.object({
  /** Type of the token (optional, typically "JWT") */
  typ: v.optional(v.literal("JWT")),

  /** Content type (optional) */
  cty: v.optional(v.string()),

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
 * JWT header schema for Unsecured JWS/JWT (alg: "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
const JwtHeaderUnsecuredSchema = v.object({
  /** Algorithm used to sign the JWT */
  alg: JoseUnsecuredAlgorithmSchema,
  ...JwtHeaderBaseSchema.entries
})

/**
 * JWT header schema for signed JWS/JWT (all algorithms except "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export const JwtHeaderSignedSchema = v.object({
  /** Algorithm used to sign the JWT */
  alg: JoseSignatureAlgorithmSchema,
  ...JwtHeaderBaseSchema.entries
})

/**
 * JWT payload (claims) schema.
 * Contains registered, public, and private claims.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4}
 */
export const JwtPayloadSchema = v.looseObject({
  /** Issuer - identifies the principal that issued the JWT */
  iss: v.optional(v.string()),

  /** Subject - identifies the principal that is the subject of the JWT */
  sub: v.optional(v.string()),

  /** Audience - identifies the recipients that the JWT is intended for */
  aud: v.optional(v.union([v.string(), v.array(v.string())])),

  /** Expiration Time - identifies the expiration time on or after which the JWT must not be accepted */
  exp: v.optional(UnixTimestampSchema),

  /** Not Before - identifies the time before which the JWT must not be accepted */
  nbf: v.optional(UnixTimestampSchema),

  /** Issued At - identifies the time at which the JWT was issued */
  iat: v.optional(UnixTimestampSchema),

  /** JWT ID - provides a unique identifier for the JWT */
  jti: v.optional(v.string())
})

/**
 * JWT object schema for Unsecured JWS/JWT (alg: "none").
 * The signature must be an empty string for Unsecured JWS/JWT.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export const JwtObjectUnsecuredSchema = v.object({
  /** JWT header containing algorithm and cryptographic parameters */
  header: JwtHeaderUnsecuredSchema,

  /** JWT payload containing claims about the token */
  payload: JwtPayloadSchema,

  /** JWT signature (empty string for Unsecured JWS/JWT) */
  signature: v.literal("")
})

/**
 * JWT object schema for signed JWS/JWT (all algorithms except "none").
 * The signature must be a valid base64url-encoded string.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export const JwtObjectSignedSchema = v.object({
  /** JWT header containing algorithm and cryptographic parameters */
  header: JwtHeaderSignedSchema,

  /** JWT payload containing claims about the token */
  payload: JwtPayloadSchema,

  /** JWT signature (base64url encoded) */
  signature: Base64UrlSchema
})

/**
 * JWT object schema with separate header, payload, and signature.
 * Represents a parsed JWT with its components.
 * Uses discriminated union based on the algorithm to enforce correct signature format.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export const JwtObjectSchema = v.union([
  JwtObjectUnsecuredSchema,
  JwtObjectSignedSchema
])
