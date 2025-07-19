import * as v from "valibot"
import { UriSchema } from "../shared/uri"
import { JsonWebKeySchema } from "../jose/jwk"
import { jsonLdContextSchema } from "../shared/json-ld"
import type {
  Did,
  DidUrl,
  DidMethod,
  VerificationMethodType,
  Service,
  ServiceEndpoint,
  DidDocument,
  LegacyVerificationMethodType,
  VerificationMethodMultikey,
  VerificationMethodJsonWebKey,
  VerificationMethodLegacy
} from "../../types/did"
import type { Shape } from "../shared/shape"
import {
  verificationMethodTypes,
  didRegex,
  didUrlRegex,
  didMethodRegex,
  legacyVerificationMethodTypes
} from "../../constants/did"

/**
 * DID URL scheme. DIDs are a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export const DidSchema = v.pipe(
  UriSchema,
  v.startsWith("did:"),
  v.regex(didRegex, "Must be a valid DID"),
  v.custom<Did>(() => true)
)

export const createDidSchema = <T extends DidMethod>(method: T) => {
  return v.pipe(
    DidSchema,
    v.startsWith(`did:${method}:`),
    v.custom<Did<T>>(() => true)
  )
}

/**
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export const DidUrlSchema = v.pipe(
  v.string(),
  v.regex(didUrlRegex, "Must be a valid DID URL"),
  v.custom<DidUrl>(() => true)
)

/**
 * DID method names. Must follow format rules: lowercase letters and numbers only.
 * @see {@link https://www.w3.org/TR/did-core/#method-syntax}
 */
export const DidMethodSchema = v.pipe(
  v.string(),
  v.regex(didMethodRegex, "Must be a valid DID method"),
  v.custom<DidMethod>(() => true)
)

/**
 * Verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export const VerificationMethodTypeSchema = v.pipe(
  v.picklist(verificationMethodTypes),
  v.custom<VerificationMethodType>(() => true)
)

/**
 * Legacy verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export const LegacyVerificationMethodTypeSchema = v.pipe(
  v.picklist(legacyVerificationMethodTypes),
  v.custom<LegacyVerificationMethodType>(() => true)
)

/**
 * Base verification method schema with common properties.
 */
const VerificationMethodBaseSchema = v.object({
  /** The verification method identifier */
  id: DidUrlSchema,

  /** The DID that controls this verification method */
  controller: DidSchema
})

/**
 * JsonWebKey verification method schema.
 */
export const VerificationMethodJsonWebKeySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: v.literal("JsonWebKey"),

  /** JSON Web Key */
  publicKeyJwk: JsonWebKeySchema
} satisfies Shape<VerificationMethodJsonWebKey>)

/**
 * Multikey verification method schema.
 */
export const VerificationMethodMultikeySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: v.literal("Multikey"),

  /** Multibase-encoded public key */
  publicKeyMultibase: v.string()
} satisfies Shape<VerificationMethodMultikey>)

/**
 * Legacy verification method schema.
 */
export const VerificationMethodLegacySchema = v.object({
  ...VerificationMethodBaseSchema.entries,
  /** The verification method type */
  type: LegacyVerificationMethodTypeSchema,

  /** Multibase-encoded public key */
  publicKeyMultibase: v.optional(v.string()),

  /** JSON Web Key */
  publicKeyJwk: v.optional(JsonWebKeySchema),

  /** Base58-encoded public key (deprecated, use publicKeyJwk) */
  publicKeyBase58: v.optional(v.string())
} satisfies Shape<VerificationMethodLegacy>)

/**
 * Verification method schema as a discriminated union.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export const VerificationMethodSchema = v.variant("type", [
  VerificationMethodJsonWebKeySchema,
  VerificationMethodMultikeySchema,
  VerificationMethodLegacySchema
])

/**
 * Service endpoint schema.
 * Can be a URI, a map, or an array of URIs and/or maps.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceEndpointSchema = v.pipe(
  v.union([
    UriSchema,
    v.record(v.string(), v.unknown()),
    v.array(v.union([UriSchema, v.record(v.string(), v.unknown())]))
  ]),
  v.custom<ServiceEndpoint>(() => true)
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
  serviceEndpoint: ServiceEndpointSchema
} satisfies Shape<Service>)

/**
 * DID Document schema.
 * @see {@link https://www.w3.org/TR/did-core/#did-documents}
 */
export const DidDocumentSchema = v.object({
  /** JSON-LD context */
  "@context": jsonLdContextSchema("https://www.w3.org/ns/did/v1"),

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
    v.array(v.union([DidUrlSchema, VerificationMethodSchema]))
  ),

  /** Assertion method verification methods */
  assertionMethod: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema]))
  ),

  /** Key agreement verification methods */
  keyAgreement: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema]))
  ),

  /** Capability invocation verification methods */
  capabilityInvocation: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema]))
  ),

  /** Capability delegation verification methods */
  capabilityDelegation: v.optional(
    v.array(v.union([DidUrlSchema, VerificationMethodSchema]))
  ),

  /** Services */
  service: v.optional(v.array(ServiceSchema))
} satisfies Shape<DidDocument>)
