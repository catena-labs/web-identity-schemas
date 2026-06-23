import * as v from "valibot"

import {
  verificationMethodTypes,
  didRegex,
  didUrlRegex,
  didMethodRegex,
  legacyVerificationMethodTypes,
  base58btcMultibaseRegex,
} from "../../constants/did"
import type {
  Did,
  DidUrl,
  DidMethod,
  VerificationMethodType,
  Service,
  ServiceEndpoint,
  ServiceEndpointMap,
  DidDocument,
  LegacyVerificationMethodType,
  VerificationMethodMultikey,
  VerificationMethodJsonWebKey,
  VerificationMethodLegacy,
} from "../../types/did"
import { JsonWebKeySchema } from "../jose/jwk"
import { DidContextSchema } from "../shared/json-ld"
import type { Shape } from "../shared/shape"
import { UriSchema } from "../shared/uri"

/**
 * DID URL scheme. DIDs are a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export const DidSchema = v.pipe(
  UriSchema,
  v.startsWith("did:"),
  v.regex(didRegex, "Must be a valid DID"),
  v.custom<Did>(() => true),
)

/**
 * Check if a value is a valid DID.
 * @param value - The value to check.
 * @returns True if the value is a valid DID, false otherwise.
 */
export function isDid(value: unknown): value is Did {
  return v.is(DidSchema, value)
}

/**
 * Create a DID schema for a specific method.
 * @param method - The method to create a schema for.
 * @returns A schema for the DID.
 */
export const createDidSchema = <T extends DidMethod>(method: T) => {
  return v.pipe(
    DidSchema,
    v.startsWith(`did:${method}:`),
    v.custom<Did<T>>(() => true),
  )
}

/**
 * Check if a value is a valid DID for a specific method.
 * @param method - The method to check.
 * @param value - The value to check.
 * @returns True if the value is a valid DID for the method, false otherwise.
 */
export function isDidWithMethod<T extends DidMethod>(
  method: T,
  value: unknown,
): value is Did<T> {
  return v.is(createDidSchema(method), value)
}

/**
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export const DidUrlSchema = v.pipe(
  v.string(),
  v.regex(didUrlRegex, "Must be a valid DID URL"),
  v.custom<DidUrl>(() => true),
)

/**
 * DID method names. Must follow format rules: lowercase letters and numbers only.
 * @see {@link https://www.w3.org/TR/did-core/#method-syntax}
 */
export const DidMethodSchema = v.pipe(
  v.string(),
  v.regex(didMethodRegex, "Must be a valid DID method"),
  v.custom<DidMethod>(() => true),
)

/**
 * Verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export const VerificationMethodTypeSchema = v.pipe(
  v.picklist(verificationMethodTypes),
  v.custom<VerificationMethodType>(() => true),
)

/**
 * Legacy verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export const LegacyVerificationMethodTypeSchema = v.pipe(
  v.picklist(legacyVerificationMethodTypes),
  v.custom<LegacyVerificationMethodType>(() => true),
)

/**
 * Base58btc multibase-encoded public key (starts with 'z').
 * @see {@link https://datatracker.ietf.org/doc/html/draft-multiformats-multibase}
 */
const Base58BtcMultibaseSchema = v.pipe(
  v.string(),
  v.regex(
    base58btcMultibaseRegex,
    "Must be a base58btc multibase-encoded value (starts with 'z')",
  ),
)

/**
 * Base verification method schema with common properties.
 */
const VerificationMethodBaseSchema = v.object({
  /** The verification method identifier */
  id: DidUrlSchema,

  /** The DID that controls this verification method */
  controller: DidSchema,
})

/**
 * JsonWebKey verification method schema.
 */
export const VerificationMethodJsonWebKeySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: v.literal("JsonWebKey"),

  /** JSON Web Key */
  publicKeyJwk: JsonWebKeySchema,
} satisfies Shape<VerificationMethodJsonWebKey>)

/**
 * Multikey verification method schema.
 */
export const VerificationMethodMultikeySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: v.literal("Multikey"),

  /** Multibase-encoded public key (base58btc) */
  publicKeyMultibase: Base58BtcMultibaseSchema,
} satisfies Shape<VerificationMethodMultikey>)

/**
 * Legacy verification method schema.
 */
export const VerificationMethodLegacySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: LegacyVerificationMethodTypeSchema,

  /** Multibase-encoded public key (base58btc) */
  publicKeyMultibase: v.optional(Base58BtcMultibaseSchema),

  /** JSON Web Key */
  publicKeyJwk: v.optional(JsonWebKeySchema),

  /** Base58-encoded public key (deprecated, use publicKeyJwk) */
  publicKeyBase58: v.optional(v.string()),
} satisfies Shape<VerificationMethodLegacy>)

/**
 * Verification method schema as a discriminated union.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export const VerificationMethodSchema = v.variant("type", [
  VerificationMethodJsonWebKeySchema,
  VerificationMethodMultikeySchema,
  VerificationMethodLegacySchema,
])

/**
 * Service endpoint map schema.
 * A map whose values are strings, string arrays, URIs, URI arrays, or
 * nested service endpoint maps.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceEndpointMapSchema: v.GenericSchema<ServiceEndpointMap> =
  v.record(
    v.string(),
    v.union([
      v.string(),
      v.array(v.string()),
      v.lazy(() => ServiceEndpointMapSchema),
    ]),
  )

/**
 * Service endpoint schema.
 * Can be a URI, a map, or an array of URIs and/or maps.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceEndpointSchema = v.pipe(
  v.union([
    UriSchema,
    ServiceEndpointMapSchema,
    v.array(v.union([UriSchema, ServiceEndpointMapSchema])),
  ]),
  v.custom<ServiceEndpoint>(() => true),
)

/**
 * Service schema.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceSchema = v.object({
  /** The service identifier */
  id: UriSchema,

  /** The service type */
  type: v.union([v.string(), v.array(v.string())]),

  /** The service endpoint */
  serviceEndpoint: ServiceEndpointSchema,
} satisfies Shape<Service>)

/**
 * DID Document schema.
 * @see {@link https://www.w3.org/TR/did-core/#did-documents}
 */
export const DidDocumentSchema = v.object({
  /** JSON-LD context */
  "@context": DidContextSchema,

  /** The DID subject */
  id: DidSchema,

  /** Also known as */
  alsoKnownAs: v.optional(v.array(UriSchema)),

  /** Controller DIDs */
  controller: v.optional(v.union([DidSchema, v.array(DidSchema)])),

  /** Verification methods */
  verificationMethod: v.optional(v.array(VerificationMethodSchema)),

  /** Authentication verification methods */
  authentication: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema])),
  ),

  /** Assertion method verification methods */
  assertionMethod: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema])),
  ),

  /** Key agreement verification methods */
  keyAgreement: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema])),
  ),

  /** Capability invocation verification methods */
  capabilityInvocation: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema])),
  ),

  /** Capability delegation verification methods */
  capabilityDelegation: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema])),
  ),

  /** Services */
  service: v.optional(v.array(ServiceSchema)),
} satisfies Shape<DidDocument>)
