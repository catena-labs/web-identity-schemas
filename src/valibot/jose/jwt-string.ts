import * as v from "valibot"

/**
 * JWT string format validation.
 * Must contain exactly 3 parts separated by periods (header.payload.signature).
 * Each part must be base64url encoded.
 * An unsecured JWT ends with a period and does contain a signature part.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export const JwtStringSchema = v.pipe(
  v.string(),
  v.regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/)
)

/**
 * JWT string parts schema.
 * Must contain exactly 3 parts separated by periods (header.payload.signature).
 * Each part must be base64url encoded.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7519#section-3}
 */
export const JwtStringPartsSchema = v.pipe(
  JwtStringSchema,
  v.transform((jwt) => {
    const [header, payload, signature] = jwt.split(".")
    if (!header || !payload) {
      throw new Error("Invalid JWT string")
    }

    return {
      header,
      payload,
      signature: signature ?? ""
    }
  })
)
