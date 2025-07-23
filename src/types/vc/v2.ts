import type {
  BasePresentation,
  BaseCredential,
  CredentialSubject,
  CredentialType,
  Verifiable
} from "./core"
import type { DateTimeStamp } from "../shared/json-ld"

/**
 * V2 Credential (unsigned).
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#credentials}
 */
export interface CredentialV2<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> extends BaseCredential<TSubject, TType> {
  validFrom?: DateTimeStamp

  /** Valid until date (V2) */
  validUntil?: DateTimeStamp
}

/**
 * V2 Verifiable Credential (signed).
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#credentials}
 */
export type VerifiableCredentialV2<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> = Verifiable<CredentialV2<TSubject, TType>>

/**
 * V2 Presentation (unsigned)
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#verifiable-presentations}
 */
export interface PresentationV2<
  TCredential extends VerifiableCredentialV2 = VerifiableCredentialV2,
  TType extends CredentialType = CredentialType
> extends BasePresentation<TCredential, TType> {}

/**
 * V2 Verifiable Presentation.
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#verifiable-presentations}
 */
export type VerifiablePresentationV2<
  TCredential extends VerifiableCredentialV2 = VerifiableCredentialV2,
  TType extends CredentialType = CredentialType
> = Verifiable<PresentationV2<TCredential, TType>>
