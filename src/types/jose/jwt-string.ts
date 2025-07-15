import type { Base64Url } from "../shared/base-64-url"

/**
 * JWT string format.
 * Must contain exactly 3 parts separated by periods (header.payload.signature).
 * Each part must be base64url encoded.
 * An unsecured JWT ends with a period and does contain a signature part.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export type JwtString = string

/**
 * JWT string parts.
 * Result of splitting a JWT string into its components.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export interface JwtStringParts {
  /** Base64url-encoded header */
  header: Base64Url

  /** Base64url-encoded payload */
  payload: Base64Url

  /** Base64url-encoded signature (empty string for unsecured JWTs) */
  signature: Base64Url | ""
}
