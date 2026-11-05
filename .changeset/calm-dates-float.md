---
"web-identity-schemas": patch
---

Accept non-integer `exp`, `nbf`, and `iat` claims in `JwtPayloadSchema`. RFC 7519 section 2 defines a NumericDate as a JSON numeric value that may be a non-integer, so a token with `"iat": 1516239022.5` is valid. Negative and non-finite values are still rejected, in both the valibot and zod builds.
