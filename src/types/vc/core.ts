import type { Proof } from "./proof"
import type { JwtString } from "../jose"
import type { JsonLdContext } from "../shared/json-ld"
import type { Uri } from "../shared/uri"
import type { ArrayContaining, OneOrMany, LooseObject } from "../shared/utils"

export type CredentialType = string | string[]

/**
 * Raw credential type value that ensures "VerifiableCredential" is always
 * present, as well as any additional types provided. Per the spec: "If more
 * than one value is provided, the order does not matter."
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
type RawCredentialType<
  TBaseType extends string,
  TAdditionalTypes extends string | string[] = never
> = [TAdditionalTypes] extends [never]
  ? TBaseType | ArrayContaining<[TBaseType], string>
  : TAdditionalTypes extends string
    ? ArrayContaining<[TBaseType, TAdditionalTypes], string>
    : TAdditionalTypes extends string[]
      ? ArrayContaining<[TBaseType, ...TAdditionalTypes], string>
      : never

/**
 * Credential type value that ensures "VerifiableCredential" is always present.
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
export type VerifiableCredentialType<
  TAdditionalTypes extends CredentialType = never
> = RawCredentialType<"VerifiableCredential", TAdditionalTypes>

/**
 * Credential type value that ensures "VerifiablePresentation" is always present.
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
export type VerifiablePresentationType<
  TAdditionalTypes extends string | string[] = never
> = RawCredentialType<"VerifiablePresentation", TAdditionalTypes>

/**
 * Credential status types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export type CredentialStatusType =
  | "RevocationList2020Status"
  | "StatusList2021Entry"
  | "BitstringStatusListEntry"
  | string // Allow custom status types

/**
 * Status purposes for credential status.
 */
export type StatusPurpose = "revocation" | "suspension" | string

/**
 * Credential status.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export interface CredentialStatus {
  /** Status entry identifier */
  id?: string

  /** Status type */
  type: CredentialStatusType

  /** Status list credential */
  statusListCredential?: string

  /** Status list index */
  statusListIndex?: string | number

  /** Status purpose */
  statusPurpose?: StatusPurpose
}

/**
 * Credential schema reference.
 * @see {@link https://www.w3.org/TR/vc-data-model/#data-schemas}
 */
export interface CredentialSchemaType {
  /** Schema identifier */
  id: Uri

  /** Schema type */
  type: string
}

/**
 * Credential subject with optional ID.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credential-subject}
 */
export interface CredentialSubject {
  /** Subject identifier (optional) */
  id?: Uri | string

  /** Additional subject properties */
  [key: string]: unknown
}

/**
 * Generic type for ID or object with id property.
 * Common pattern in verifiable credentials for issuer, holder, etc.
 */
export type IdOrObject<TId extends Uri = Uri> =
  | TId
  | { id: TId; [key: string]: unknown }

/**
 * Generic resource reference used for evidence, refresh services, and terms of use.
 * @see {@link https://www.w3.org/TR/vc-data-model/}
 */
export interface GenericResource {
  /** Resource identifier (optional) */
  id?: Uri | string

  /** Resource type */
  type: string | string[]

  /** Additional properties */
  [key: string]: unknown
}

/**
 * Makes any credential verifiable by ensuring it has a required proof.
 * A verifiable record is one that includes cryptographic proof.
 *
 * @template T - The credential type to make verifiable
 */
export type Verifiable<T> = T & {
  /** Cryptographic proof that makes the credential verifiable */
  proof: Proof | Proof[]
}

/**
 * Base W3C Credential without proof (unsigned credential).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export interface BaseCredential<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> extends LooseObject<{
    /** JSON-LD context */
    "@context": JsonLdContext

    /** Credential identifier (optional) */
    id?: Uri

    /** Credential types (must include VerifiableCredential) */
    type: VerifiableCredentialType<TType>

    /** Credential issuer */
    issuer: IdOrObject

    /** Credential status (optional) */
    credentialStatus?: OneOrMany<CredentialStatus>

    /** Credential schema (optional) */
    credentialSchema?: OneOrMany<CredentialSchemaType>

    /** Credential subject */
    credentialSubject: OneOrMany<TSubject>

    /** Evidence (optional) */
    evidence?: OneOrMany<GenericResource>

    /** Refresh service (optional) */
    refreshService?: OneOrMany<GenericResource>

    /** Terms of use (optional) */
    termsOfUse?: OneOrMany<GenericResource>
  }> {}

/**
 * Base Verifiable Presentation properties.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#verifiable-presentations}
 */
export interface BasePresentation<
  TCredential extends BaseCredential,
  TType extends CredentialType = CredentialType
> {
  /** JSON-LD context (V1) */
  "@context": JsonLdContext

  /** Presentation identifier (optional) */
  id?: Uri

  /** Presentation types (must include VerifiablePresentation) */
  type: VerifiablePresentationType<TType>

  /** Verifiable credentials */
  verifiableCredential?: (TCredential | JwtString)[]

  /** Presentation holder (optional) */
  holder?: IdOrObject
}
