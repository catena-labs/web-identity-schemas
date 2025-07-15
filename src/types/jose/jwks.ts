import type { JsonWebKey } from "./jwk"

/**
 * JSON Web Key Set.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-5}
 */
export interface JsonWebKeySet {
  /** Array of JSON Web Keys */
  keys: JsonWebKey[]
}
