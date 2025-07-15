import type { JsonLdContext } from "../shared"
import type { Uri } from "../shared/uri"

/**
 * DID method names. Must follow format rules: lowercase letters and numbers only.
 * @see {@link https://www.w3.org/TR/did-core/#method-syntax}
 */
export type DidMethod = string

/**
 * DID (Decentralized Identifier) type.
 * A DID is a subset of URIs with specific format requirements.
 * @see {@link https://www.w3.org/TR/did-core/#did-syntax}
 */
export type Did<
  TMethod extends DidMethod = DidMethod,
  TIdentifier extends string = string
> = Uri<"did", `${TMethod}:${TIdentifier}`>

/**
 * DID URL with optional path, query, and fragment.
 * @see {@link https://www.w3.org/TR/did-core/#did-url-syntax}
 */
export type DidUrl = Did

/**
 * Verification method type.
 * @see {@link https://www.w3.org/TR/did-spec-registries/#verification-method-types}
 */
export type VerificationMethodType =
  | "JsonWebKey2020"
  | "Ed25519VerificationKey2020"
  | "Ed25519VerificationKey2018"
  | "X25519KeyAgreementKey2020"
  | "X25519KeyAgreementKey2019"
  | "EcdsaSecp256k1VerificationKey2019"
  | "EcdsaSecp256r1VerificationKey2019"
  | "RsaVerificationKey2018"

/**
 * Verification method.
 * @see {@link https://www.w3.org/TR/did-core/#verification-methods}
 */
export interface VerificationMethod {
  /** A string that conforms to the rules in 3.2 DID URL Syntax. */
  id: DidUrl

  /** The verification method type. */
  type: VerificationMethodType

  /** A string that conforms to the rules in 3.1 DID Syntax. */
  controller: Did

  /** A map representing a JSON Web Key that conforms to [RFC7517]. */
  publicKeyJwk?: unknown

  /** A string that conforms to a multibase encoded public key. */
  publicKeyMultibase?: string

  /** @deprecated usa {@link publicKeyMultibase} or {@link publicKeyJwk} instead */
  publicKeyBase58?: string
}

export interface ServiceEndpointMap {
  [key: string]: string | string[] | Uri | ServiceEndpointMap
}

/** A service endpoint is a string that conforms to the rules of [RFC3986] for URIs, a map, or a set composed of a one or more strings that conform to the rules of [RFC3986] for URIs and/or maps.  */
export type ServiceEndpoint =
  | Uri
  | ServiceEndpointMap
  | (Uri | ServiceEndpointMap)[]

/**
 * Service endpoint.
 * @see {@link https://www.w3.org/TR/did-core/#services}
 */
export interface Service {
  /** A string that conforms to the rules of [RFC3986] for URIs. */
  id: Uri

  /** A string or a set of strings. */
  type: string | string[]

  /** A string that conforms to the rules of [RFC3986] for URIs, a map, or a set composed of a one or more strings that conform to the rules of [RFC3986] for URIs and/or maps. */
  serviceEndpoint: ServiceEndpoint
}

/**
 * DID Document.
 * @see {@link https://www.w3.org/TR/did-1.0/#core-properties}
 */
export interface DidDocument {
  /** JSON-LD context */
  "@context": JsonLdContext

  /** A string that conforms to the rules in 3.1 DID Syntax. */
  id: Did

  /** A set of strings that conform to the rules of [RFC3986] for URIs. */
  alsoKnownAs?: Uri[]

  /** A string or a set of strings that conform to the rules in 3.1 DID Syntax. */
  controller?: Did | Did[]

  /** A set of Verification Method maps that conform to the rules in Verification Method properties. */
  verificationMethod?: VerificationMethod[]

  /** A set of either Verification Method maps that conform to the rules in Verification Method properties) or strings that conform to the rules in 3.2 DID URL Syntax. */
  authentication?: (DidUrl | VerificationMethod)[]

  /** Assertion method verification methods */
  assertionMethod?: (DidUrl | VerificationMethod)[]

  /** Key agreement verification methods */
  keyAgreement?: (DidUrl | VerificationMethod)[]

  /** Capability invocation verification methods */
  capabilityInvocation?: (DidUrl | VerificationMethod)[]

  /** Capability delegation verification methods */
  capabilityDelegation?: (DidUrl | VerificationMethod)[]

  /** A set of Service Endpoint maps that conform to the rules in Service properties. */
  service?: Service[]
}
