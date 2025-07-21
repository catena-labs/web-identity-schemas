import type { JsonWebKeySet } from "../../types/jose/jwks"
import type { Shape } from "../shared/shape"
import * as z from "zod"
import { JsonWebKeySchema } from "./jwk"

/**
 * JSON Web Key Set schema.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-5}
 *
 * @example
 * {
 *   "keys": [
 *     { "kty": "RSA", "n": "...", "e": "AQAB" }
 *   ]
 * }
 */
export const JsonWebKeySetSchema: Shape<JsonWebKeySet> = z.object({
  keys: z.array(JsonWebKeySchema)
})
