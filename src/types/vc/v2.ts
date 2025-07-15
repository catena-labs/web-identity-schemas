import type {
  BaseCredential,
  BasePresentation,
  CredentialSubject,
  CredentialType
} from "./core"
import type { DateTimeStamp } from "../shared/json-ld"

/**
 * V2 Verifiable Credential.
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#credentials}
 */
export interface VerifiableCredentialV2<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> extends BaseCredential<TSubject, TType> {
  validFrom?: DateTimeStamp

  /** Valid until date (V2) */
  validUntil?: DateTimeStamp
}

/**
 * V2 Verifiable Presentation.
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#verifiable-presentations}
 */
export interface VerifiablePresentationV2<
  TCredential extends VerifiableCredentialV2 = VerifiableCredentialV2,
  TType extends CredentialType = CredentialType
> extends BasePresentation<TCredential, TType> {}
