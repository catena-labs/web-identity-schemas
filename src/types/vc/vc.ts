import type { CredentialSubject, CredentialType, Verifiable } from "./core"
import type { CredentialV1, PresentationV1, VerifiableCredentialV1 } from "./v1"
import type { CredentialV2, PresentationV2, VerifiableCredentialV2 } from "./v2"

export type Credential<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> = CredentialV1<TSubject, TType> | CredentialV2<TSubject, TType>

export type VerifiableCredential<
  TSubject extends CredentialSubject = CredentialSubject,
  TType extends CredentialType = CredentialType
> = Verifiable<Credential<TSubject, TType>>

export type Presentation<
  TCredential extends VerifiableCredential = VerifiableCredential,
  TType extends CredentialType = CredentialType
> = TCredential extends VerifiableCredentialV1
  ? PresentationV1<TCredential, TType>
  : TCredential extends VerifiableCredentialV2
    ? PresentationV2<TCredential, TType>
    : PresentationV1 | PresentationV2

export type VerifiablePresentation<
  TCredential extends VerifiableCredential = VerifiableCredential,
  TType extends CredentialType = CredentialType
> = Verifiable<Presentation<TCredential, TType>>
