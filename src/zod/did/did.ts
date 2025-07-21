import * as z from "zod"
import { JsonWebKeySchema } from "../jose/jwk"
import { UriSchema } from "../shared/uri"
import { jsonLdContextSchema } from "../shared/json-ld"
import type {
  ServiceEndpoint,
  VerificationMethod,
  Service,
  DidDocument,
  DidUrl,
  Did,
  VerificationMethodType,
  ServiceEndpointMap,
  DidMethod,
  LegacyVerificationMethodType
} from "../../types/did"
import type { Shape } from "../shared/shape"
import {
  didMethodRegex,
  didRegex,
  didUrlRegex,
  legacyVerificationMethodTypes,
  verificationMethodTypes
} from "../../constants/did"

/**
 * DID URL scheme. DIDs are a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export const DidSchema = z
  .string()
  .regex(didRegex, "Must be a valid DID")
  .pipe(z.custom<Did>())

/**
 * Check if a value is a valid DID.
 * @param value - The value to check.
 * @returns True if the value is a valid DID, false otherwise.
 */
export function isDid(value: unknown): value is Did {
  return DidSchema.safeParse(value).success
}

/**
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export const DidUrlSchema = z
  .string()
  .regex(didUrlRegex, "Must be a valid DID URL")
  .pipe(z.custom<DidUrl>())

/**
 * Create a DID schema for a specific method.
 * @param method - The method name.
 * @returns The DID schema.
 */
export const createDidSchema = <T extends DidMethod>(method: T) => {
  return z
    .string()
    .regex(didRegex, "Must be a valid DID")
    .startsWith(`did:${method}:`)
    .pipe(z.custom<Did<T>>())
}

/**
 * Check if a value is a valid DID for a specific method.
 * @param value - The value to check.
 * @param method - The method to check.
 * @returns True if the value is a valid DID for the method, false otherwise.
 */
export function isDidWithMethod<T extends DidMethod>(
  value: unknown,
  method: T
): value is Did<T> {
  return createDidSchema(method).safeParse(value).success
}

/**
 * DID method names. Must follow format rules: lowercase letters and numbers only.
 * @see {@link https://www.w3.org/TR/did-core/#method-syntax}
 */
export const DidMethodSchema = z
  .string()
  .regex(didMethodRegex)
  .pipe(z.custom<DidMethod>())

/**
 * Verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export const VerificationMethodTypeSchema: Shape<VerificationMethodType> =
  z.enum(verificationMethodTypes)

export const LegacyVerificationMethodTypeSchema: Shape<LegacyVerificationMethodType> =
  z.enum(legacyVerificationMethodTypes)

/**
 * Base verification method schema with common properties.
 */
const VerificationMethodBaseSchema = z.object({
  /** The verification method identifier */
  id: DidUrlSchema,

  /** The DID that controls this verification method */
  controller: DidSchema
})

/**
 * JsonWebKey verification method schema.
 */
export const VerificationMethodJsonWebKeySchema = z.object({
  ...VerificationMethodBaseSchema.shape,
  /** The verification method type */
  type: z.literal("JsonWebKey"),

  /** JSON Web Key */
  publicKeyJwk: JsonWebKeySchema
})

export const VerificationMethodMultikeySchema = z.object({
  ...VerificationMethodBaseSchema.shape,
  /** The verification method type */
  type: z.literal("Multikey"),

  /** Multibase-encoded public key */
  publicKeyMultibase: z.string()
})

export const VerificationMethodLegacySchema = z.object({
  ...VerificationMethodBaseSchema.shape,
  /** The verification method type */
  type: LegacyVerificationMethodTypeSchema,

  /** Multibase-encoded public key */
  publicKeyMultibase: z.string().optional(),

  /** JSON Web Key */
  publicKeyJwk: JsonWebKeySchema.optional(),

  /** Base58-encoded public key (deprecated, use publicKeyJwk) */
  publicKeyBase58: z.string().optional()
})

/**
 * Verification method schema.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export const VerificationMethodSchema: Shape<VerificationMethod> =
  z.discriminatedUnion("type", [
    VerificationMethodJsonWebKeySchema,
    VerificationMethodMultikeySchema,
    VerificationMethodLegacySchema
  ])

export const ServiceEndpointMapSchema: Shape<ServiceEndpointMap> = z.record(
  z.string(),
  z.union([
    z.string(),
    z.array(z.string()),
    UriSchema,
    z.array(UriSchema),
    z.lazy(() => ServiceEndpointMapSchema)
  ])
)

/**
 * Service endpoint schema.
 * Can be a URI, a map, or an array of URIs and/or maps.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceEndpointSchema: Shape<ServiceEndpoint> = z.union([
  UriSchema,
  ServiceEndpointMapSchema,
  z.array(z.union([UriSchema, ServiceEndpointMapSchema]))
])

/**
 * Service schema.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export const ServiceSchema: Shape<Service> = z.object({
  /** The service identifier */
  id: UriSchema,

  /** The service type */
  type: z.union([z.string(), z.array(z.string())]),

  /** The service endpoint */
  serviceEndpoint: ServiceEndpointSchema
})

/**
 * DID Document schema.
 * @see {@link https://www.w3.org/TR/did-core/#did-documents}
 */
export const DidDocumentSchema: Shape<DidDocument> = z.object({
  /** JSON-LD context */
  "@context": jsonLdContextSchema("https://www.w3.org/ns/did/v1"),

  /** The DID subject */
  id: DidSchema,

  /** Also known as */
  alsoKnownAs: z.array(UriSchema).optional(),

  /** Controller DIDs */
  controller: z.union([DidSchema, z.array(DidSchema)]).optional(),

  /** Verification methods */
  verificationMethod: z.array(VerificationMethodSchema).optional(),

  /** Authentication verification methods */
  authentication: z
    .array(z.union([DidUrlSchema, VerificationMethodSchema]))
    .optional(),

  /** Assertion method verification methods */
  assertionMethod: z
    .array(z.union([DidUrlSchema, VerificationMethodSchema]))
    .optional(),

  /** Key agreement verification methods */
  keyAgreement: z
    .array(z.union([DidUrlSchema, VerificationMethodSchema]))
    .optional(),

  /** Capability invocation verification methods */
  capabilityInvocation: z
    .array(z.union([DidUrlSchema, VerificationMethodSchema]))
    .optional(),

  /** Capability delegation verification methods */
  capabilityDelegation: z
    .array(z.union([DidUrlSchema, VerificationMethodSchema]))
    .optional(),

  /** Services */
  service: z.array(ServiceSchema).optional()
})
