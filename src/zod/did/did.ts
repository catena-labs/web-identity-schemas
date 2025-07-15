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
  DidMethod
} from "../../types/did"
import type { Shape } from "../shared/shape"
import { didMethodRegex, didRegex, didUrlRegex } from "../../constants/did"

/**
 * DID URL scheme. DIDs are a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export const DidSchema = z
  .string()
  .regex(didRegex, "Must be a valid DID")
  .pipe(z.custom<Did>())

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
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export const DidUrlSchema = z
  .string()
  .regex(didUrlRegex, "Must be a valid DID URL")
  .pipe(z.custom<DidUrl>())

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
  z.union([
    z.literal("JsonWebKey2020"),
    z.literal("Ed25519VerificationKey2020"),
    z.literal("Ed25519VerificationKey2018"),
    z.literal("X25519KeyAgreementKey2020"),
    z.literal("X25519KeyAgreementKey2019"),
    z.literal("EcdsaSecp256k1VerificationKey2019"),
    z.literal("EcdsaSecp256r1VerificationKey2019"),
    z.literal("RsaVerificationKey2018")
  ])

/**
 * Verification method schema.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export const VerificationMethodSchema: Shape<VerificationMethod> = z.object({
  /** The verification method identifier */
  id: DidUrlSchema,

  /** The verification method type */
  type: VerificationMethodTypeSchema,

  /** The DID that controls this verification method */
  controller: DidSchema,

  /** JSON Web Key (if type is JsonWebKey2020) */
  publicKeyJwk: JsonWebKeySchema.optional(),

  /** Base58-encoded public key (deprecated, use publicKeyJwk) */
  publicKeyBase58: z.string().optional(),

  /** Multibase-encoded public key */
  publicKeyMultibase: z.string().optional()
})

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
