import type {
  JoseSignatureAlgorithm,
  JoseUnsecuredAlgorithm,
  JoseAlgorithm,
  JweContentEncryptionAlgorithm,
  JweKeyManagementAlgorithm,
  JoseCompressionAlgorithm
} from "../../types/shared/algorithms"
import * as v from "valibot"
import {
  joseSignatureAlgorithms,
  joseUnsecuredAlgorithm,
  joseAlgorithms,
  jweContentEncryptionAlgorithms,
  jweKeyManagementAlgorithms,
  joseCompressionAlgorithms
} from "../../constants/algorithms"

/**
 * JSON Web Signature algorithms that require cryptographic signatures.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518}
 *
 * @example
 * "RS256" // RSA with SHA-256
 * "ES256" // ECDSA with P-256 and SHA-256
 */
export const JoseSignatureAlgorithmSchema = v.pipe(
  v.picklist(joseSignatureAlgorithms),
  v.custom<JoseSignatureAlgorithm>(() => true)
)

/**
 * Algorithm for Unsecured JWS/JWT.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1}
 *
 * @example
 * "none" // No signature algorithm
 */
export const JoseUnsecuredAlgorithmSchema = v.pipe(
  v.literal(joseUnsecuredAlgorithm),
  v.custom<JoseUnsecuredAlgorithm>(() => true)
)

/**
 * JSON Web Signature and Encryption Algorithms.
 * Union of all signature algorithms including the unsecured algorithm.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518}
 *
 * @example
 * "HS256" // HMAC with SHA-256
 * "none" // Unsecured algorithm
 */
export const JoseAlgorithmSchema = v.pipe(
  v.picklist(joseAlgorithms),
  v.custom<JoseAlgorithm>(() => true)
)

/**
 * JSON Web Encryption Content Encryption Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-5.1}
 *
 * @example
 * "A128GCM" // AES-128 with GCM
 * "A256GCM" // AES-256 with GCM
 */
export const JweContentEncryptionAlgorithmSchema = v.pipe(
  v.picklist(jweContentEncryptionAlgorithms),
  v.custom<JweContentEncryptionAlgorithm>(() => true)
)

/**
 * JSON Web Encryption Key Management Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-4.1}
 *
 * @example
 * "RSA1_5" // RSAES-PKCS1-v1_5
 * "dir" // Direct use of shared symmetric key
 */
export const JweKeyManagementAlgorithmSchema = v.pipe(
  v.picklist(jweKeyManagementAlgorithms),
  v.custom<JweKeyManagementAlgorithm>(() => true)
)

/**
 * JSON Web Signature and Encryption Compression Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-7.3}
 *
 * @example
 * "DEF" // DEFLATE compression algorithm
 */
export const JoseCompressionAlgorithmSchema = v.pipe(
  v.picklist(joseCompressionAlgorithms),
  v.custom<JoseCompressionAlgorithm>(() => true)
)
