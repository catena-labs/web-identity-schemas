/**
 * Shared cryptographic curve constants.
 * These can be used across different validation libraries (valibot, zod, etc.)
 */

/**
 * Elliptic curves for Elliptic Curve Digital Signature Algorithm (ECDSA).
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-6.2.1.1}
 */
export const ellipticCurves = [
  "P-256", // secp256r1
  "secp256r1", // sometimes used instead of P-256
  "P-256K", // sometimes used instead of secp256k1
  "secp256k1", // bitcoin/ethereum
  "P-384", // secp384r1
  "P-521" // secp521r1
] as const

/**
 * Octet string key pairs curves for EdDSA and ECDH.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc8037#section-2}
 */
export const octetKeyPairCurves = [
  "Ed25519", // EdDSA signature
  "Ed448", // EdDSA signature
  "X25519", // ECDH key agreement
  "X448" // ECDH key agreement
] as const

/**
 * All supported cryptographic curves.
 */
export const cryptographicCurves = [
  ...ellipticCurves,
  ...octetKeyPairCurves
] as const
