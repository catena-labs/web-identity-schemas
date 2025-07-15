import type { Base64Url } from "../shared/base-64-url"
import type { JoseAlgorithm } from "../shared/algorithms"
import type { JsonWebKey } from "./jwk"

/**
 * JWS Protected Header.
 * Contains algorithm and other cryptographic parameters for JWS.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1}
 */
export interface JwsProtectedHeader {
  /** Algorithm used to sign the JWS */
  alg: JoseAlgorithm

  /** Key ID (optional) */
  kid?: string

  /** JSON Web Key Set URL (optional) */
  jku?: string

  /** JSON Web Key (optional) */
  jwk?: JsonWebKey

  /** X.509 URL (optional) */
  x5u?: string

  /** X.509 Certificate Chain (optional) */
  x5c?: string[]

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t?: Base64Url

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256"?: Base64Url

  /** Type of the token (optional) */
  typ?: string

  /** Content type (optional) */
  cty?: string

  /** Critical header parameter (optional) */
  crit?: string[]
}

/**
 * JWS Unprotected Header.
 * Contains additional header parameters that are not integrity protected.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.2}
 */
export interface JwsUnprotectedHeader {
  /** Key ID (optional) */
  kid?: string

  /** JSON Web Key Set URL (optional) */
  jku?: string

  /** JSON Web Key (optional) */
  jwk?: JsonWebKey

  /** X.509 URL (optional) */
  x5u?: string

  /** X.509 Certificate Chain (optional) */
  x5c?: string[]

  /** X.509 Certificate SHA-1 Thumbprint (optional) */
  x5t?: Base64Url

  /** X.509 Certificate SHA-256 Thumbprint (optional) */
  "x5t#S256"?: Base64Url

  /** Critical header parameter (optional) */
  crit?: string[]
}

/**
 * JWS signature.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.1}
 */
export interface JwsSignature {
  /** Protected header (base64url-encoded) */
  protected?: Base64Url

  /** Unprotected header */
  header?: JwsUnprotectedHeader

  /** Signature (base64url-encoded) */
  signature: Base64Url
}

/**
 * JWS General JSON Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.1}
 */
export interface JwsGeneralJson {
  /** Base64url-encoded payload */
  payload: Base64Url

  /** Array of signatures */
  signatures: JwsSignature[]
}

/**
 * JWS Flattened JSON Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.2.2}
 */
export interface JwsFlattenedJson {
  /** Base64url-encoded payload */
  payload: Base64Url

  /** Protected header (base64url-encoded) */
  protected?: Base64Url

  /** Unprotected header */
  header?: JwsUnprotectedHeader

  /** Signature (base64url-encoded) */
  signature: Base64Url
}

/**
 * JWS string in compact serialization format.
 * Must contain exactly 3 parts separated by periods.
 * Format: header.payload.signature
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export type JwsString = `${string}.${string}.${string}`

/**
 * JWS Compact Serialization.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-7.1}
 */
export type JwsCompact = string

/**
 * JWS - union of all serialization formats.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515}
 */
export type Jws = JwsCompact | JwsFlattenedJson | JwsGeneralJson
