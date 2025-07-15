import type { BaseCredential, CredentialSubject, StatusPurpose } from "../core"
import type { Base64Url } from "../../shared/base-64-url"
import type { DateTimeStamp } from "../../shared/json-ld"

/**
 * BitstringStatusList credential subject.
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/#bitstringstatuslistcredential}
 */
export interface BitstringStatusListCredentialSubject
  extends CredentialSubject {
  /** Type of the credential subject */
  type: "BitstringStatusList"

  /** Purpose of the status list (revocation or suspension) */
  statusPurpose: StatusPurpose

  /** Base64url-encoded status list */
  encodedList: Base64Url

  /** Time to live for the status list in seconds (optional) */
  ttl?: number
}

/**
 * BitstringStatusList Credential.
 * contexts: [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/status/v1"
  ],
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/#bitstringstatuslistcredential}
 */
export interface BitstringStatusListCredential
  extends BaseCredential<
    BitstringStatusListCredentialSubject,
    "BitstringStatusListCredential"
  > {
  /** Valid from date (V2) */
  validFrom?: DateTimeStamp

  /** Valid until date (V2) */
  validUntil?: DateTimeStamp
}
