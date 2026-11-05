---
"web-identity-schemas": patch
---

Accept JWE algorithms in a JWK's `alg` member (RFC 7517 section 4.4). Before, `alg` accepted only JWS algorithms, so an encryption key such as `{ "use": "enc", "alg": "RSA-OAEP" }` failed `JsonWebKeySchema`, and one such key made a whole `JsonWebKeySetSchema` fail. Add `JwkAlgorithmSchema` and the `JwkAlgorithm` type.
