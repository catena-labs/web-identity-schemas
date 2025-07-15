import * as z from "zod"
import type { Base64Url } from "../../types/shared/base-64-url"

/**
 * Base64url encoding pattern.
 * Allows characters A-Z, a-z, 0-9, '-', '_'.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-2} / {@link https://datatracker.ietf.org/doc/html/rfc4648#section-5}
 */
export const Base64UrlSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]+$/)
  .pipe(z.custom<Base64Url>())
