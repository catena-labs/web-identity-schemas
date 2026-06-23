# Vision

## What this is

**Conforming Zod, Valibot, and Standard Schema validators — plus first-class
TypeScript types — for building software on open web standards.**

`web-identity-schemas` is a single, dependency-light source of truth for the
data shapes defined by the W3C and IETF standards that modern applications keep
re-implementing by hand: Decentralized Identifiers, Verifiable Credentials and
Presentations, and the full JOSE family (JWT, JWS, JWE, JWK/JWKS, JWA).

For every standard it covers, the library ships three things that always agree:

1. A **TypeScript type** that precisely describes the shape.
2. A **Valibot schema** that validates and narrows to that type.
3. A **Zod (v4) schema** that validates and narrows to that same type.

You pick the validator your stack already uses — or none, and consume the types
alone. Because both schema implementations are surfaced through the
[Standard Schema](https://github.com/standard-schema/standard-schema) interface,
they also drop directly into any tool that speaks Standard Schema (form
libraries, RPC frameworks, AI tool-call validation, etc.) without adapters.

## Why it exists

Standards like DID Core, the VC Data Model, and the JOSE RFCs are precise but
verbose. Most projects end up with a partial, subtly-wrong, copy-pasted version
of these shapes — a JWK validator that forgets a key type, a VC type guard that
ignores `@context` ordering, a DID regex that drifts from the ABNF. Worse, the
runtime validation and the TypeScript type are usually written separately and
quietly diverge.

This project collapses that work into one audited, spec-referenced package where
the type and the runtime schema are developed together and tested against the
same fixtures and the same suite. Every schema links back to the clause of the
spec it implements.

## Naming

The package is named for "web identity," but its scope is broader: it is really
**schemas for modern web standards**. JOSE (JWT/JWS/JWE/JWK) is foundational to
auth, API security, and signing far beyond identity. Treat the name as
historical; the mission is "conforming, dual-validator schemas for the open
standards web apps are built on," and the surface is expected to grow toward
adjacent standards over time.

## Principles

- **Spec-faithful.** Validation tracks the normative documents (W3C DID Core,
  VC Data Model v1.1 & v2.0, Bitstring Status List, RFC 7515–7519, RFC 7638).
  Each schema cites its source. Deliberate deviations are documented as such.
- **Three artifacts, one truth.** The TypeScript type, the Valibot schema, and
  the Zod schema for a given concept accept and reject the same inputs and infer
  the same output. Parity is a tested guarantee, not an aspiration.
- **Validator-agnostic, framework-agnostic.** Valibot and Zod are optional peer
  dependencies. Importing `/valibot` never pulls in Zod and vice versa. The root
  entry is types-only and pulls in neither. Standard Schema is the common
  contract.
- **Strict types, no escape hatches in public output.** No `any`; `as` casts are
  avoided in favor of validated `custom`/`satisfies` patterns so inferred types
  are honest.
- **Tree-shakeable and small.** Pure ESM, `sideEffects: false`, granular
  exports, no runtime dependencies of its own.
- **Composable.** Schemas are building blocks (`Did<"web">`, signed vs unsigned
  credential variants, per-key-type JWK schemas) meant to be extended and
  embedded, not just used whole.

## Who it's for

- Teams implementing DID/VC issuance, verification, or wallets.
- Anyone validating JWTs, JWKs, or JWS/JWE payloads at a trust boundary.
- Library and API authors who want a typed, validated representation of these
  standards instead of `unknown` and hand-written guards.
- Agent and AI systems that need verifiable identity and signed-credential
  shapes for tool I/O.

## Non-goals

- **Not a crypto library.** It validates structure and format; it does not sign,
  verify signatures, derive keys, or perform cryptographic operations.
- **Not a DID resolver or VC issuer.** It defines the shapes those systems move
  around; it does not implement the protocols.
- **Not a JSON-LD processor.** It validates `@context` presence and structure,
  not full JSON-LD expansion/normalization.

## Success looks like

A developer can `import` the exact type and a matching validator for any DID,
VC, or JOSE object, trust that it conforms to the standard, swap Valibot for Zod
(or neither) without changing behavior, and never write one of these shapes by
hand again.
