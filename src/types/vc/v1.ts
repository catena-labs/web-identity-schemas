import type {
  BasePresentation,
  BaseCredential,
  CredentialSubject,
  CredentialType,
  Verifiable
} from "./core"
import type { DateTimeStamp } from "../shared/json-ld"

/**
 * V1 Credential (unsigned).
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#credentials}
 */
export interface CredentialV1<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> extends BaseCredential<TSubject, TType> {
  /** Issuance date (V1) */
  issuanceDate: DateTimeStamp

  /** Expiration date (V1) */
  expirationDate?: DateTimeStamp
}

/**
 * V1 Verifiable Credential (signed).
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#credentials}
 */
export type VerifiableCredentialV1<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> = Verifiable<CredentialV1<TSubject, TType>>

/**
 * V1 Presentation (unsigned)
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#verifiable-presentations}
 */
export interface PresentationV1<
  TCredential extends VerifiableCredentialV1 = VerifiableCredentialV1,
  TType extends CredentialType = CredentialType
> extends BasePresentation<TCredential, TType> {}

/**
 * V1 Verifiable Presentation.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#verifiable-presentations}
 */
export type VerifiablePresentationV1<
  TCredential extends VerifiableCredentialV1 = VerifiableCredentialV1,
  TType extends CredentialType = CredentialType
> = Verifiable<PresentationV1<TCredential, TType>>
