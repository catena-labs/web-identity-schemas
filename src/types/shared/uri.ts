/**
 * URI type according to RFC 3986.
 * Generic URI with scheme and scheme-specific part.
 * @see {@link https://tools.ietf.org/html/rfc3986}
 */
export type Uri<
  TScheme extends string = string,
  TPath extends string = string
> = `${TScheme}:${TPath}`
