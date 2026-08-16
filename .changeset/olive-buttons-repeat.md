---
"web-identity-schemas": patch
---

Fix Valibot record schemas accepting arrays. `ServiceEndpointMapSchema` and the
inline JSON-LD context object schema now reject arrays, so a `serviceEndpoint`
or `@context` array is no longer silently rebuilt as an object keyed by `"0"`,
`"1"`, ... This matches the Zod implementations, whose `z.record()` already
rejects arrays.
