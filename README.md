# Web Identity Schemas

TypeScript types and validation schemas for Web Identity and JOSE standards, including:

- Decentralized Identifiers (DID)
- Verifiable Credentials (VC) v1.1 and v2.0, with StatusList2021, Bitstring Status List
- Verifiable Presentations (VP)
- JSON Web Tokens (JWT)
- JSON Web Keys (JWK)
- JSON Web Signatures (JWS)
- [See the full list](#available-schemas)

This library provides both Valibot and Zod (v4) validation implementations with comprehensive type safety.

## Installation

```bash
npm install web-identity-schemas
```

## Quick Start

### Valibot

```typescript
import * as v from "valibot"
import {
  DidSchema,
  JwkSchema,
  VerifiableCredentialSchema
} from "web-identity-schemas/valibot"

// Validate a DID
const validDid = v.parse(DidSchema, "did:example:123456789abcdefghi")

// Validate a Verifiable Credential
const validVc = v.parse(VerifiableCredentialSchema, {
  "@context": "https://www.w3.org/2018/credentials/v1",
  type: "VerifiableCredential",
  issuer: "did:example:issuer",
  issuanceDate: "2023-01-01T00:00:00Z",
  credentialSubject: {
    id: "did:example:subject",
    degree: "Bachelor of Science"
  }
})

// Validate cryptographic keys
const validKey = v.parse(JsonWebKeySchema, {
  kty: "EC",
  crv: "P-256",
  x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
})
```

### Zod v4

```typescript
import * as z from "zod"
import {
  DidSchema,
  JwkSchema,
  VerifiableCredentialSchema
} from "web-identity-schemas/zod"

// Validate a DID
const validDid = DidSchema.parse("did:example:123456789abcdefghi")

// Validate a Verifiable Credential
const validVc = VerifiableCredentialSchema.parse({
  "@context": "https://www.w3.org/2018/credentials/v1",
  type: "VerifiableCredential",
  issuer: "did:example:issuer",
  issuanceDate: "2023-01-01T00:00:00Z",
  credentialSubject: {
    id: "did:example:subject",
    degree: "Bachelor of Science"
  }
})

// Validate cryptographic keys
const validKey = JsonWebKeySchema.parse({
  kty: "EC",
  crv: "P-256",
  x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
})
```

## Type Safety

All types are also available as Typescript types at the root of the package, and in each schema export

```typescript
import type { Did, DidDocument, JwtString } from "web-identity-schemas"
// or from "web-identity-schemas/valibot"
// or from "web-identity-schemas/zod"

const jwt: JwtString = "..."

const did: Did = "did:method:something"
const didWeb: Did<"web"> = "did:web:example.com"

const didDocument: DidDocument = {
  // ...
}
```

## Available Schemas

This library exports comprehensive schemas for Web Identity and JOSE standards. All schemas are available in both Valibot and Zod implementations, with corresponding TypeScript types.

### Core Web Identity Schemas

#### Decentralized Identifiers (DIDs)

- **`DidSchema`** - Validates DID strings (e.g., `did:example:123`)
  - [Types](./src/types/did/did.ts) | [Valibot](./src/valibot/did/did.ts) | [Zod](./src/zod/did/did.ts)
- **`DidUrlSchema`** - Validates DID URLs with paths/queries/fragments
  - [Types](./src/types/did/did.ts) | [Valibot](./src/valibot/did/did.ts) | [Zod](./src/zod/did/did.ts)
- **`DidDocumentSchema`** - Validates DID Documents
  - [Types](./src/types/did/did.ts) | [Valibot](./src/valibot/did/did.ts) | [Zod](./src/zod/did/did.ts)
- **`VerificationMethodSchema`** - Validates verification methods in DID Documents
  - [Types](./src/types/did/did.ts) | [Valibot](./src/valibot/did/did.ts) | [Zod](./src/zod/did/did.ts)
- **`ServiceSchema`** - Validates service endpoints in DID Documents
  - [Types](./src/types/did/did.ts) | [Valibot](./src/valibot/did/did.ts) | [Zod](./src/zod/did/did.ts)

#### Verifiable Credentials (VCs)

- **`VerifiableCredentialSchema`** - Universal VC validator (v1.1 and v2.0)
  - [Types](./src/types/vc/vc.ts) | [Valibot](./src/valibot/vc/vc.ts) | [Zod](./src/zod/vc/vc.ts)
- **`VerifiableCredentialV1Schema`** - Specific v1.1 VC validator
  - [Types](./src/types/vc/v1.ts) | [Valibot](./src/valibot/vc/v1.ts) | [Zod](./src/zod/vc/v1.ts)
- **`VerifiableCredentialV2Schema`** - Specific v2.0 VC validator
  - [Types](./src/types/vc/v2.ts) | [Valibot](./src/valibot/vc/v2.ts) | [Zod](./src/zod/vc/v2.ts)
- **`VerifiablePresentationSchema`** - Validates verifiable presentations
  - [Types](./src/types/vc/core.ts) | [Valibot](./src/valibot/vc/vp.ts) | [Zod](./src/zod/vc/vp.ts)

#### JSON Web Tokens (JWTs)

- **`JwtObjectSchema`** - Validates JWT objects (header + payload)
  - [Types](./src/types/jose/jwt.ts) | [Valibot](./src/valibot/jose/jwt.ts) | [Zod](./src/zod/jose/jwt.ts)
- **`JwtStringSchema`** - Validates JWT strings in compact format
  - [Types](./src/types/jose/jwt-string.ts) | [Valibot](./src/valibot/jose/jwt-string.ts) | [Zod](./src/zod/jose/jwt-string.ts)
- **`JwtHeaderSignedSchema`** - Validates JWT headers for signed tokens
  - [Types](./src/types/jose/jwt.ts) | [Valibot](./src/valibot/jose/jwt.ts) | [Zod](./src/zod/jose/jwt.ts)
- **`JwtPayloadSchema`** - Validates JWT payloads
  - [Types](./src/types/jose/jwt.ts) | [Valibot](./src/valibot/jose/jwt.ts) | [Zod](./src/zod/jose/jwt.ts)

#### JSON Web Keys (JWKs)

- **`JsonWebKeySchema`** - Universal JWK validator (all key types)
  - [Types](./src/types/jose/jwk.ts) | [Valibot](./src/valibot/jose/jwk.ts) | [Zod](./src/zod/jose/jwk.ts)
- **`JsonWebKeySetSchema`** - Validates JWK Sets
  - [Types](./src/types/jose/jwks.ts) | [Valibot](./src/valibot/jose/jwks.ts) | [Zod](./src/zod/jose/jwks.ts)

### Cryptographic Schemas

#### Specific JWK Types

- **`RsaJwkSchema`** - RSA keys (kty: "RSA")
  - [Types](./src/types/jose/jwk.ts) | [Valibot](./src/valibot/jose/jwk.ts) | [Zod](./src/zod/jose/jwk.ts)
- **`EcJwkSchema`** - Elliptic Curve keys (kty: "EC")
  - [Types](./src/types/jose/jwk.ts) | [Valibot](./src/valibot/jose/jwk.ts) | [Zod](./src/zod/jose/jwk.ts)
- **`OctJwkSchema`** - Symmetric keys (kty: "oct")
  - [Types](./src/types/jose/jwk.ts) | [Valibot](./src/valibot/jose/jwk.ts) | [Zod](./src/zod/jose/jwk.ts)
- **`OkpJwkSchema`** - Octet Key Pair keys (kty: "OKP")
  - [Types](./src/types/jose/jwk.ts) | [Valibot](./src/valibot/jose/jwk.ts) | [Zod](./src/zod/jose/jwk.ts)

#### Cryptographic Curves

- **`EllipticCurveSchema`** - Elliptic curve names (P-256, P-384, etc.)
  - [Types](./src/types/shared/curves.ts) | [Valibot](./src/valibot/shared/curves.ts) | [Zod](./src/zod/shared/curves.ts)
- **`OctetKeyPairCurveSchema`** - OKP curve names (Ed25519, X25519)
  - [Types](./src/types/shared/curves.ts) | [Valibot](./src/valibot/shared/curves.ts) | [Zod](./src/zod/shared/curves.ts)

### JOSE Specifications

#### JSON Web Signatures (JWS)

- **`JwsObjectSchema`** - JWS in object format
  - [Types](./src/types/jose/jws.ts) | [Valibot](./src/valibot/jose/jws.ts) | [Zod](./src/zod/jose/jws.ts)
- **`JwsStringSchema`** - JWS in compact string format
  - [Types](./src/types/jose/jws.ts) | [Valibot](./src/valibot/jose/jws.ts) | [Zod](./src/zod/jose/jws.ts)
- **`JwsJsonSerializationSchema`** - JWS JSON General Serialization
  - [Types](./src/types/jose/jws.ts) | [Valibot](./src/valibot/jose/jws.ts) | [Zod](./src/zod/jose/jws.ts)
- **`JwsFlattenedJsonSerializationSchema`** - JWS JSON Flattened Serialization
  - [Types](./src/types/jose/jws.ts) | [Valibot](./src/valibot/jose/jws.ts) | [Zod](./src/zod/jose/jws.ts)

#### JSON Web Encryption (JWE)

- **`JweObjectSchema`** - JWE in object format
  - [Types](./src/types/jose/jwe.ts) | [Valibot](./src/valibot/jose/jwe.ts) | [Zod](./src/zod/jose/jwe.ts)
- **`JweStringSchema`** - JWE in compact string format
  - [Types](./src/types/jose/jwe.ts) | [Valibot](./src/valibot/jose/jwe.ts) | [Zod](./src/zod/jose/jwe.ts)
- **`JweJsonSerializationSchema`** - JWE JSON General Serialization
  - [Types](./src/types/jose/jwe.ts) | [Valibot](./src/valibot/jose/jwe.ts) | [Zod](./src/zod/jose/jwe.ts)
- **`JweFlattenedJsonSerializationSchema`** - JWE JSON Flattened Serialization
  - [Types](./src/types/jose/jwe.ts) | [Valibot](./src/valibot/jose/jwe.ts) | [Zod](./src/zod/jose/jwe.ts)

#### JOSE Algorithms

- **`JoseAlgorithmSchema`** - All JOSE algorithms
  - [Types](./src/types/shared/algorithms.ts) | [Valibot](./src/valibot/jose/jwa.ts) | [Zod](./src/zod/jose/jwa.ts)
- **`JoseSignatureAlgorithmSchema`** - Signature algorithms (RS256, ES256, etc.)
  - [Types](./src/types/shared/algorithms.ts) | [Valibot](./src/valibot/jose/jwa.ts) | [Zod](./src/zod/jose/jwa.ts)
- **`JweContentEncryptionAlgorithmSchema`** - Content encryption algorithms
  - [Types](./src/types/shared/algorithms.ts) | [Valibot](./src/valibot/jose/jwa.ts) | [Zod](./src/zod/jose/jwa.ts)
- **`JweKeyManagementAlgorithmSchema`** - Key management algorithms
  - [Types](./src/types/shared/algorithms.ts) | [Valibot](./src/valibot/jose/jwa.ts) | [Zod](./src/zod/jose/jwa.ts)

### Status and Proof Schemas

#### Credential Status

- **`StatusList2021CredentialSchema`** - StatusList2021 credentials
  - [Types](./src/types/vc/status/statuslist2021.ts) | [Valibot](./src/valibot/vc/status/statuslist2021.ts) | [Zod](./src/zod/vc/status/statuslist2021.ts)
- **`BitstringStatusListCredentialSchema`** - Bitstring status credentials
  - [Types](./src/types/vc/status/bitstring.ts) | [Valibot](./src/valibot/vc/status/bitstring.ts) | [Zod](./src/zod/vc/status/bitstring.ts)

#### Proof Systems

- **`ProofSchema`** - Cryptographic proof objects
  - [Types](./src/types/vc/proof.ts) | [Valibot](./src/valibot/vc/core.ts) | [Zod](./src/zod/vc/core.ts)

### Utility Schemas

#### Common Formats

- **`UriSchema`** - URI format validation
  - [Types](./src/types/shared/uri.ts) | [Valibot](./src/valibot/shared/uri.ts) | [Zod](./src/zod/shared/uri.ts)
- **`Base64UrlSchema`** - Base64url encoded strings
  - [Types](./src/types/shared/base-64.ts) | [Valibot](./src/valibot/shared/base-64.ts) | [Zod](./src/zod/shared/base-64.ts)
- **`Base64Schema`** - Base64 encoded strings
  - [Types](./src/types/shared/base-64.ts) | [Valibot](./src/valibot/shared/base-64.ts) | [Zod](./src/zod/shared/base-64.ts)
- **`DateTimeStampSchema`** - ISO 8601 datetime strings
  - [Types](./src/types/shared/json-ld.ts) | [Valibot](./src/valibot/shared/json-ld.ts) | [Zod](./src/zod/shared/json-ld.ts)

## Contributing

Contributions are welcome.

This library maintains strict type safety and comprehensive test coverage. Both Valibot and Zod implementations must pass identical test suites to ensure consistency.

See [`CLAUDE.md`](./CLAUDE.md) for detailed development guidelines and schema patterns.

## License (MIT)

Copyright (c) 2025 [Catena Labs, Inc](https://catenalabs.com). See [`LICENSE`](./LICENSE) for details.
