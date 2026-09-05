import { safeParse as valibotSafeParse } from "valibot"
import { describe, expect, test } from "vitest"

import * as valibot from "../src/valibot"
import * as zod from "../src/zod"

/**
 * Cross-library parity suite.
 *
 * The project convention is that the valibot and zod schemas pass identical
 * test suites, but most existing tests validate each namespace in isolation
 * against shared fixtures. These tests instead assert that both
 * implementations agree on the outcome for edge-case inputs where the
 * underlying validation libraries differ the most: URL validation, regex
 * behavior, and permissive/strict base64 handling.
 */

type Case = [label: string, input: unknown]

const didCases: Case[] = [
  ["method with digits only", "did:12345:example"],
  ["single-char method", "did:x:example"],
  ["method id ends with dot", "did:web:example."],
  ["method id starts with dot", "did:web:.example"],
  ["double colon inside id", "did:web:ex::ample"],
  ["pct-encoded lowercase hex", "did:web:ex%2fample"],
  ["pct-encoded uppercase hex", "did:web:ex%2Fample"],
  ["pct-encoded non-hex", "did:web:ex%zzample"],
  ["pct-encoded truncated", "did:web:ex%2"],
  ["unicode in id", "did:web:ünïcode"],
  ["space in id", "did:web:ex ample"],
  ["plus in id", "did:web:ex+ample"],
  ["tilde in id", "did:web:ex~ample"],
  ["at-sign in id", "did:web:ex@ample"],
  ["empty method-specific id", "did:web:"],
  ["trailing colon id", "did:web:example:"],
  ["leading newline", "\ndid:web:example"],
  ["trailing newline", "did:web:example\n"],
  ["http url", "https://example.com"],
  ["did-only prefix", "did:"],
  ["empty string", ""],
]

const didUrlCases: Case[] = [
  ["path", "did:web:example.com/path"],
  ["query", "did:web:example.com?x=1"],
  ["query multiple", "did:web:example.com?a=1&b=2"],
  ["fragment", "did:web:example.com#key-1"],
  ["full", "did:web:example.com/path?x=1#key-1"],
  ["empty fragment", "did:web:example.com#"],
  ["empty query", "did:web:example.com?"],
  ["bare did", "did:web:example.com"],
  ["fragment with slash", "did:web:example.com#frag/ok"],
  ["fragment with question", "did:web:example.com#frag?ok"],
  ["query with slash and question", "did:web:example.com?a/b?c"],
  ["two fragments", "did:web:example.com#frag#more"],
  ["hash inside query", "did:web:example.com?q#f#more"],
  ["question after fragment", "did:web:example.com#frag?x#more"],
  ["colon in path", "did:web:example.com/a:b"],
]

const jwkCases: Case[] = [
  ["oct minimal", { kty: "oct", k: "aGVsbG8" }],
  ["oct missing k", { kty: "oct" }],
  ["RSA minimal", { kty: "RSA", n: "aGVsbG8", e: "AQAB" }],
  ["RSA missing n", { kty: "RSA", e: "AQAB" }],
  ["RSA missing e", { kty: "RSA", n: "aGVsbG8" }],
  ["EC minimal", { kty: "EC", crv: "P-256", x: "aGVsbG8", y: "aGVsbG8" }],
  ["EC unknown curve", { kty: "EC", crv: "P-999", x: "a", y: "b" }],
  ["OKP minimal", { kty: "OKP", crv: "Ed25519", x: "aGVsbG8" }],
  ["OKP unknown curve", { kty: "OKP", crv: "Ed448", x: "aGVsbG8" }],
  ["unknown kty", { kty: "XYZ", x: "aGVsbG8" }],
  [
    "x5u https url",
    { kty: "oct", k: "aGVsbG8", x5u: "https://example.com/cert" },
  ],
  [
    "x5u http url",
    { kty: "oct", k: "aGVsbG8", x5u: "http://example.com/cert" },
  ],
  ["x5u not a url", { kty: "oct", k: "aGVsbG8", x5u: "example.com" }],
  ["x5u relative path", { kty: "oct", k: "aGVsbG8", x5u: "/cert" }],
  ["x5u mailto", { kty: "oct", k: "aGVsbG8", x5u: "mailto:foo@example.com" }],
  [
    "x5u unicode host",
    { kty: "oct", k: "aGVsbG8", x5u: "https://exämple.com/cert" },
  ],
  [
    "x5u trailing dot host",
    { kty: "oct", k: "aGVsbG8", x5u: "https://example./cert" },
  ],
]

const base64Cases: Case[] = [
  ["standard with padding", "aGVsbG8="],
  ["standard without padding", "aGVsbG8"],
  ["url-safe chars", "a-b_c"],
  ["standard chars plus slash", "a+b/c"],
  ["empty string", ""],
  ["padding in middle", "ab=cd"],
  ["single char", "a"],
  ["invalid chars", "aGVsbG8!"],
]

/** A minimal validation surface both schema libraries expose. */
interface Validatable {
  safeParse: (input: unknown) => { success: boolean }
}

/** A valibot schema that can be run through `valibotSafeParse`. */
type ValibotSchema = Parameters<typeof valibotSafeParse>[0]

/**
 * Asserts that the zod and valibot versions of a schema agree on the
 * validity of every case. Case labels appear in the assertion message so a
 * divergence is immediately identifiable.
 */
function testSchema(
  cases: Case[],
  zodSchema: Validatable,
  valibotSchema: ValibotSchema,
): void {
  for (const [label, input] of cases) {
    const zodOk = zodSchema.safeParse(input).success
    const valibotOk = valibotSafeParse(valibotSchema, input).success
    expect(
      zodOk,
      `${label}: zod=${zodOk}, valibot=${valibotOk}, input=${JSON.stringify(input)}`,
    ).toBe(valibotOk)
  }
}

describe("zod/valibot parity", () => {
  test("DidSchema agrees on all edge cases", () => {
    testSchema(didCases, zod.DidSchema, valibot.DidSchema)
  })

  test("DidUrlSchema agrees on all edge cases", () => {
    testSchema(didUrlCases, zod.DidUrlSchema, valibot.DidUrlSchema)
  })

  test("JsonWebKeySchema agrees on all edge cases", () => {
    testSchema(jwkCases, zod.JsonWebKeySchema, valibot.JsonWebKeySchema)
  })

  test("Base64UrlSchema agrees on all edge cases", () => {
    testSchema(base64Cases, zod.Base64UrlSchema, valibot.Base64UrlSchema)
  })

  test("Base64Schema agrees on all edge cases", () => {
    testSchema(base64Cases, zod.Base64Schema, valibot.Base64Schema)
  })
})
