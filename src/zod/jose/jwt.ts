import * as z from "zod"
import { Base64UrlSchema } from "../shared/base-64-url"
import {
  JoseSignatureAlgorithmSchema,
  JoseUnsecuredAlgorithmSchema
} from "./jwa"
import { JsonWebKeySchema } from "./jwk"
import type {
  UnixTimestamp,
  JwtHeader,
  JwtHeaderUnsecured,
  JwtHeaderSigned,
  JwtPayload,
  JwtObject,
  JwtObjectUnsecured,
  JwtObjectSigned
} from "../../types/jose/jwt"
import type { Shape } from "../shared/shape"

const UnixTimestampSchema = z
  .number()
  .int("Unix timestamp must be an integer")
  .min(0, "Unix timestamp must be non-negative")
  .pipe(z.custom<UnixTimestamp>())

/**
 * Common JWT header fields for all algorithms.
 * Contains cryptographic parameters excluding the algorithm.
 */
const JwtHeaderBaseSchema = z.object({
  /** Type of the token (optional, typically "JWT") */
  typ: z.literal("JWT").optional(),

  /** Content type (optional) */
  cty: z.string().optional(),

  /** Key ID (optional) */
  kid: z.string().optional(),

  /** JSON Web Key Set URL (optional) */
  jku: z.url().optional(),

  /** JSON Web Key (optional) */
  jwk: JsonWebKeySchema.optional(),

  /** X.509 URL (optional) */
  x5u: z.url().optional(),

  /** X.509 Certificate Chain (optional) */
  x5c: z.array(z.string()).optional(),

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t: Base64UrlSchema.optional(),

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256": Base64UrlSchema.optional(),

  /** Critical header parameter (optional) */
  crit: z.array(z.string()).optional()
})

/**
 * JWT header schema for Unsecured JWS/JWT (alg: "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
const JwtHeaderUnsecuredSchema: Shape<JwtHeaderUnsecured> = z.object({
  ...JwtHeaderBaseSchema.shape,
  /** Algorithm used to sign the JWT */
  alg: JoseUnsecuredAlgorithmSchema
})

/**
 * JWT header schema for signed JWS/JWT (all algorithms except "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export const JwtHeaderSignedSchema: Shape<JwtHeaderSigned> = z.object({
  ...JwtHeaderBaseSchema.shape,
  /** Algorithm used to sign the JWT */
  alg: JoseSignatureAlgorithmSchema
}) satisfies Shape<JwtHeaderSigned>

/**
 * JWT header schema union for all algorithms.
 * Contains algorithm and other cryptographic parameters.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export const JwtHeaderSchema: Shape<JwtHeader> = z.union([
  JwtHeaderUnsecuredSchema,
  JwtHeaderSignedSchema
])

/**
 * JWT payload (claims) schema.
 * Contains registered, public, and private claims.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4}
 */
export const JwtPayloadSchema: Shape<JwtPayload> = z
  .object({
    /** Issuer - identifies the principal that issued the JWT */
    iss: z.string().optional(),

    /** Subject - identifies the principal that is the subject of the JWT */
    sub: z.string().optional(),

    /** Audience - identifies the recipients that the JWT is intended for */
    aud: z.union([z.string(), z.array(z.string())]).optional(),

    /** Expiration Time - identifies the expiration time on or after which the JWT must not be accepted */
    exp: UnixTimestampSchema.optional(),

    /** Not Before - identifies the time before which the JWT must not be accepted */
    nbf: UnixTimestampSchema.optional(),

    /** Issued At - identifies the time at which the JWT was issued */
    iat: UnixTimestampSchema.optional(),

    /** JWT ID - provides a unique identifier for the JWT */
    jti: z.string().optional()
  })
  .loose() // Allow additional custom claims

/**
 * JWT object schema for Unsecured JWS/JWT (alg: "none").
 * The signature must be an empty string for Unsecured JWS/JWT.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
const JwtObjectUnsecuredSchema: Shape<JwtObjectUnsecured> = z.object({
  /** JWT header containing algorithm and cryptographic parameters */
  header: JwtHeaderUnsecuredSchema,

  /** JWT payload containing claims about the token */
  payload: JwtPayloadSchema,

  /** JWT signature (empty string for Unsecured JWS/JWT) */
  signature: z.literal("")
})

/**
 * JWT object schema for signed JWS/JWT (all algorithms except "none").
 * The signature must be a valid base64url-encoded string.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
const JwtObjectSignedSchema: Shape<JwtObjectSigned> = z.object({
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
export const JwtObjectSchema: Shape<JwtObject> = z.union([
  JwtObjectUnsecuredSchema,
  JwtObjectSignedSchema
])
