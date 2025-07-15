/**
 * Base64url encoding type.
 * String that contains only characters A-Z, a-z, 0-9, '-', '_'.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-2}
 * @see {@link https://datatracker.ietf.org/doc/html/rfc4648#section-5}
 *
 * @example
 * "SGVsbG8gV29ybGQ" // "Hello World" base64url encoded
 * "eyJhbGciOiJIUzI1NiJ9" // JWT header example
 */
export type Base64Url = string
