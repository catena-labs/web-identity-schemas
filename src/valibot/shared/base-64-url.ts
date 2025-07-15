import * as v from "valibot"
import type { Base64Url } from "../../types/shared/base-64-url"

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
