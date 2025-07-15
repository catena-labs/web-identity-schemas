import * as v from "valibot"
import { UriSchema } from "../shared/uri"
import { JsonWebKeySchema } from "../jose/jwk"
import { jsonLdContextSchema } from "../shared/json-ld"
import type {
  Did,
  DidUrl,
  DidMethod,
  VerificationMethodType,
  VerificationMethod,
  Service,
  ServiceEndpoint,
  DidDocument
} from "../../types/did"
import type { Shape } from "../shared/shape"
import { verificationMethodTypes } from "../../constants/did"

/**
 * DID URL scheme. DIDs are a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export const DidSchema = v.pipe(
  UriSchema,
  v.startsWith("did:"),
  v.regex(
    /^did:[a-z0-9]+:[a-zA-Z0-9.\-_:]*[a-zA-Z0-9.\-_]$/,
    "Must be a valid DID"
  ),
  v.custom<Did>(() => true)
)

export const createDidSchema = <T extends DidMethod>(method: T) => {
  return v.pipe(
    UriSchema,
    v.startsWith("did:"),
    v.regex(
      new RegExp(`^did:${method}:[a-zA-Z0-9.\-_:]*[a-zA-Z0-9.\-_]$`),
      "Must be a valid DID"
    ),
    v.custom<Did<T>>(() => true)
  )
}

/**
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export const DidUrlSchema = v.pipe(
  v.string(),
  v.regex(
    /^did:[a-z0-9]+:[a-zA-Z0-9.\-_:]*[a-zA-Z0-9.\-_](\/[^?#]*)?(\?[^#]*)?(#.*)?$/,
    "Must be a valid DID URL"
  ),
  v.custom<DidUrl>(() => true)
)

/**
 * DID method names. Must follow format rules: lowercase letters and numbers only.
 * @see {@link https://www.w3.org/TR/did-core/#method-syntax}
 */
export const DidMethodSchema = v.pipe(
  v.string(),
  v.regex(/^[a-z0-9]+$/),
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
 * Verification method schema.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export const VerificationMethodSchema = v.object({
  /** The verification method identifier */
  id: DidUrlSchema,

  /** The verification method type */
  type: VerificationMethodTypeSchema,

  /** The DID that controls this verification method */
  controller: DidSchema,

  /** JSON Web Key (if type is JsonWebKey2020) */
  publicKeyJwk: v.optional(JsonWebKeySchema),

  /** Multibase-encoded public key */
  publicKeyMultibase: v.optional(v.string()),

  /** Base58-encoded public key (deprecated, use publicKeyJwk) */
  publicKeyBase58: v.optional(v.string())
} satisfies Shape<VerificationMethod>)

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
