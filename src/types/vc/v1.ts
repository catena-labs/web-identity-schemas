import type {
  BaseCredential,
  BasePresentation,
  CredentialSubject,
  CredentialType
} from "./core"
import type { DateTimeStamp } from "../shared/json-ld"

/**
 * V1 Verifiable Credential.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#credentials}
 */
export interface VerifiableCredentialV1<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> extends BaseCredential<TSubject, TType> {
  /** Issuance date (V1) */
  issuanceDate: DateTimeStamp

  /** Expiration date (V1) */
  expirationDate?: DateTimeStamp
}

/**
 * V1 Verifiable Presentation.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#verifiable-presentations}
 */
export interface VerifiablePresentationV1<
  TCredential extends VerifiableCredentialV1 = VerifiableCredentialV1,
  TType extends CredentialType = CredentialType
> extends BasePresentation<TCredential, TType> {}
