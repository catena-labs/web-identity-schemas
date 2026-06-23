import * as v from "valibot"

import type { JsonWebKeySet } from "../../types/jose/jwks"
import type { Shape } from "../shared/shape"
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
export const JsonWebKeySetSchema = v.object({
  keys: v.array(JsonWebKeySchema),
} satisfies Shape<JsonWebKeySet>)
