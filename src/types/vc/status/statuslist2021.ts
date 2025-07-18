import type { BaseCredential, CredentialSubject, StatusPurpose } from "../core"
import type { Base64Url } from "../../shared/base-64"
import type { DateTimeStamp } from "../../shared/json-ld"

/**
 * StatusList2021 credential subject.
 * @see {@link https://www.w3.org/TR/vc-status-list/#statuslist2021credential}
 */
export interface StatusList2021CredentialSubject extends CredentialSubject {
  /** Type of the credential subject */
  type: "StatusList2021"

  /** Purpose of the status list (revocation or suspension) */
  statusPurpose: StatusPurpose

  /** Base64url-encoded status list */
  encodedList: Base64Url
}

/**
 * StatusList2021 Credential.
 * @see {@link https://www.w3.org/TR/vc-status-list/#statuslist2021credential}
 */
export interface StatusList2021Credential
  extends BaseCredential<
    StatusList2021CredentialSubject,
    "StatusList2021Credential"
  > {
  /** Issuance date (V1) */
  issuanceDate: DateTimeStamp

  /** Expiration date (V1) */
  expirationDate?: DateTimeStamp
}
