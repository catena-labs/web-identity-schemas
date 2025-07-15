/**
 * JSON Web Signature algorithms that require cryptographic signatures.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518}
 */
export type JoseSignatureAlgorithm =
  // HMAC with SHA-2 Functions
  | "HS256"
  | "HS384"
  | "HS512"
  // RSA PKCS#1 v1.5 Digital Signature with SHA-2 Functions
  | "RS256"
  | "RS384"
  | "RS512"
  // ECDSA with SHA-2 Functions
  | "ES256"
  | "ES256K" // secp256k1 (bitcoin curve)
  | "ES384"
  | "ES512"
  // RSA PSS Digital Signature with SHA-2 Functions
  | "PS256"
  | "PS384"
  | "PS512"
  // EdDSA signature algorithms
  | "EdDSA"

/**
 * Algorithm for Unsecured JWS/JWT.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7515#section-4.1.1}
 */
export type JoseUnsecuredAlgorithm = "none"

/**
 * All JOSE signature algorithms including unsecured.
 */
export type JoseAlgorithm = JoseSignatureAlgorithm | JoseUnsecuredAlgorithm

/**
 * JSON Web Encryption Content Encryption Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-5.1}
 */
export type JweContentEncryptionAlgorithm =
  // AES using 128-bit key in Galois/Counter Mode
  | "A128GCM"
  // AES using 192-bit key in Galois/Counter Mode
  | "A192GCM"
  // AES using 256-bit key in Galois/Counter Mode
  | "A256GCM"
  // AES using 128-bit key in CBC mode with HMAC SHA-256
  | "A128CBC-HS256"
  // AES using 192-bit key in CBC mode with HMAC SHA-384
  | "A192CBC-HS384"
  // AES using 256-bit key in CBC mode with HMAC SHA-512
  | "A256CBC-HS512"

/**
 * JSON Web Encryption Key Management Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-4.1}
 */
export type JweKeyManagementAlgorithm =
  // RSA PKCS#1 v1.5
  | "RSA1_5"
  // RSA OAEP
  | "RSA-OAEP"
  // RSA OAEP using SHA-256
  | "RSA-OAEP-256"
  // AES Key Wrap using 128-bit key
  | "A128KW"
  // AES Key Wrap using 192-bit key
  | "A192KW"
  // AES Key Wrap using 256-bit key
  | "A256KW"
  // Direct use of a shared symmetric key
  | "dir"
  // Elliptic Curve Diffie-Hellman Ephemeral Static key agreement
  | "ECDH-ES"
  // ECDH-ES using Concat KDF and AES Key Wrap with a 128-bit key
  | "ECDH-ES+A128KW"
  // ECDH-ES using Concat KDF and AES Key Wrap with a 192-bit key
  | "ECDH-ES+A192KW"
  // ECDH-ES using Concat KDF and AES Key Wrap with a 256-bit key
  | "ECDH-ES+A256KW"
  // AES GCM Key Wrap using 128-bit key
  | "A128GCMKW"
  // AES GCM Key Wrap using 192-bit key
  | "A192GCMKW"
  // AES GCM Key Wrap using 256-bit key
  | "A256GCMKW"
  // PBES2 with HMAC SHA-256 and AES Key Wrap with a 128-bit key
  | "PBES2-HS256+A128KW"
  // PBES2 with HMAC SHA-384 and AES Key Wrap with a 192-bit key
  | "PBES2-HS384+A192KW"
  // PBES2 with HMAC SHA-512 and AES Key Wrap with a 256-bit key
  | "PBES2-HS512+A256KW"

/**
 * JSON Web Signature and Encryption Compression Algorithms.
 * @see {@link https://datatracker.ietf.org/doc/html/rfc7518#section-7.3}
 */
export type JoseCompressionAlgorithm =
  // DEFLATE Compression Algorithm
  "DEF"
