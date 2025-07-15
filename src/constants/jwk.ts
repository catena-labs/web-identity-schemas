/**
 * Shared JSON Web Key constants.
 * These can be used across different validation libraries (valibot, zod, etc.)
 */

/**
 * Key types for JSON Web Keys.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.1}
 */
export const keyTypes = [
  "RSA", // RSA keys
  "EC", // Elliptic Curve keys
  "oct", // Octet sequence (symmetric keys)
  "OKP" // Octet string key pairs (Ed25519, X25519, etc.)
] as const

/**
 * Public key uses for JSON Web Keys.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.2}
 */
export const keyUses = [
  "sig", // Signature
  "enc" // Encryption
] as const

/**
 * Key operations for JSON Web Keys.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7517#section-4.3}
 */
export const keyOperations = [
  "sign", // Compute digital signature or MAC
  "verify", // Verify digital signature or MAC
  "encrypt", // Encrypt content
  "decrypt", // Decrypt content and validate decryption, if applicable
  "wrapKey", // Encrypt key
  "unwrapKey", // Decrypt key and validate decryption, if applicable
  "deriveKey", // Derive key
  "deriveBits" // Derive bits not to be used as a key
] as const
