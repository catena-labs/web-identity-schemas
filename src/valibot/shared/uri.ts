import type { Uri } from "../../types/shared/uri"
import * as v from "valibot"

/**
 * URI schema according to RFC 3986.
 * Matches any valid URI with scheme and scheme-specific part.
 * @see {@link https://tools.ietf.org/html/rfc3986}
 */
export const UriSchema = v.pipe(
  v.string(),
  v.regex(/^[a-zA-Z][a-zA-Z0-9+.-]*:.+/, "Must be a valid URI with scheme"),
  v.custom<Uri>(() => true)
)
