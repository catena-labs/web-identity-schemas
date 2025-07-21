import type { Base64Url, Base64 } from "../../types/shared/base-64"
import * as v from "valibot"

/**
 * Base64url encoding pattern.
 * Allows characters A-Z, a-z, 0-9, '-', '_'.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-2} / {@link https://datatracker.ietf.org/doc/html/rfc4648#section-5}
 *
 * @example
 * "SGVsbG8gV29ybGQ" // "Hello World" base64url encoded
 * "eyJhbGciOiJIUzI1NiJ9" // JWT header example
 */
export const Base64UrlSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+$/),
  v.custom<Base64Url>(() => true)
)

/**
 * Base64 encoding pattern.
 * Allows characters A-Z, a-z, 0-9, '+', '/', and optional '=' padding.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4648#section-4}
 *
 * @example
 * "SGVsbG8gV29ybGQ=" // "Hello World" base64 encoded
 * "U29tZSBkYXRhLw==" // "Some data/" base64 encoded
 */
export const Base64Schema = v.pipe(
  v.string(),
  v.regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
  v.custom<Base64>(() => true)
)
