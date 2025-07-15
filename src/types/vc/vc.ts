import type { VerifiableCredentialV1, VerifiablePresentationV1 } from "./v1"
import type { VerifiableCredentialV2, VerifiablePresentationV2 } from "./v2"
import type { CredentialSubject, CredentialType } from "./core"

export type VerifiableCredential<
  TType extends CredentialType = CredentialType,
  TSubject extends CredentialSubject = CredentialSubject
> =
  | VerifiableCredentialV1<TSubject, TType>
  | VerifiableCredentialV2<TSubject, TType>

export type VerifiablePresentation<
  TCredential extends VerifiableCredential = VerifiableCredential,
  TType extends CredentialType = CredentialType
> = TCredential extends VerifiableCredentialV1
  ? VerifiablePresentationV1<TCredential, TType>
  : TCredential extends VerifiableCredentialV2
    ? VerifiablePresentationV2<TCredential, TType>
    : VerifiablePresentationV1 | VerifiablePresentationV2
