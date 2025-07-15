import type { Base64Url } from "../shared/base-64-url"
import type {
  JoseSignatureAlgorithm,
  JoseUnsecuredAlgorithm
} from "../shared/algorithms"
import type { JsonWebKey } from "./jwk"

/**
 * Unix timestamp type.
 */
export type UnixTimestamp = number

/**
 * Common JWT header fields for all algorithms.
 * Contains cryptographic parameters excluding the algorithm.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export interface JwtHeaderBase {
  /** Type of the token (optional, typically "JWT") */
  typ?: "JWT"

  /** Content type (optional) */
  cty?: string

  /** Key ID (optional) */
  kid?: string

  /** JSON Web Key Set URL (optional) */
  jku?: string

  /** JSON Web Key (optional) */
  jwk?: JsonWebKey

  /** X.509 URL (optional) */
  x5u?: string

  /** X.509 Certificate Chain (optional) */
  x5c?: string[]

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t?: Base64Url

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256"?: Base64Url

  /** Critical header parameter (optional) */
  crit?: string[]
}

/**
 * JWT header for Unsecured JWS/JWT (alg: "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export interface JwtHeaderUnsecured extends JwtHeaderBase {
  /** Algorithm used to sign the JWT */
  alg: JoseUnsecuredAlgorithm
}

/**
 * JWT header for signed JWS/JWT (all algorithms except "none").
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export interface JwtHeaderSigned extends JwtHeaderBase {
  /** Algorithm used to sign the JWT */
  alg: JoseSignatureAlgorithm
}

/**
 * JWT header - union of all header types.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-5}
 */
export type JwtHeader = JwtHeaderUnsecured | JwtHeaderSigned

/**
 * JWT payload (claims).
 * Contains registered, public, and private claims.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-4}
 */
export interface JwtPayload {
  /** Issuer - identifies the principal that issued the JWT */
  iss?: string

  /** Subject - identifies the principal that is the subject of the JWT */
  sub?: string

  /** Audience - identifies the recipients that the JWT is intended for */
  aud?: string | string[]

  /** Expiration Time - identifies the expiration time on or after which the JWT must not be accepted */
  exp?: UnixTimestamp

  /** Not Before - identifies the time before which the JWT must not be accepted */
  nbf?: UnixTimestamp

  /** Issued At - identifies the time at which the JWT was issued */
  iat?: UnixTimestamp

  /** JWT ID - provides a unique identifier for the JWT */
  jti?: string

  /** Additional claims */
  [key: string]: unknown
}

/**
 * JWT object for Unsecured JWS/JWT (alg: "none").
 * The signature must be an empty string for Unsecured JWS/JWT.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export interface JwtObjectUnsecured {
  /** JWT header containing algorithm and cryptographic parameters */
  header: JwtHeaderUnsecured

  /** JWT payload containing claims about the token */
  payload: JwtPayload

  /** JWT signature (empty string for Unsecured JWS/JWT) */
  signature: ""
}

/**
 * JWT object for signed JWS/JWT (all algorithms except "none").
 * The signature must be a valid base64url-encoded string.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export interface JwtObjectSigned {
  /** JWT header containing algorithm and cryptographic parameters */
  header: JwtHeaderSigned

  /** JWT payload containing claims about the token */
  payload: JwtPayload

  /** JWT signature (base64url encoded) */
  signature: Base64Url
}

/**
 * JWT object with separate header, payload, and signature.
 * Represents a parsed JWT with its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export type JwtObject = JwtObjectUnsecured | JwtObjectSigned
