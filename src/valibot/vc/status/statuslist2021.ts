import * as v from "valibot"
import { DidSchema } from "../../did"
import { Base64UrlSchema } from "../../shared/base-64-url"
import {
  statusList2021Context,
  statusPurposes,
  vcV1CoreContext
} from "../../../constants/vc"
import { BaseCredentialSchema, vcTypeSchema } from "../core"
import { jsonLdContextSchema } from "../../shared/json-ld"
import type { Shape } from "../../shared/shape"
import type {
  StatusList2021CredentialSubject,
  StatusList2021Credential
} from "../../../types/vc/status/statuslist2021"

/**
 * StatusList2021 context (for V1 credentials).
 * @see {@link https://w3c.github.io/vc-status-list-2021/}
 */
export const StatusList2021ContextSchema = v.literal(statusList2021Context)

/**
 * StatusList2021 credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-status-list/#statuslist2021credential}
 */
export const StatusList2021CredentialSubjectSchema = v.object({
  /** Credential subject identifier */
  id: v.optional(DidSchema),

  /** Type of the credential subject */
  type: v.literal("StatusList2021"),

  /** Purpose of the status list (revocation or suspension) */
  statusPurpose: v.picklist(statusPurposes),

  /** Base64url-encoded status list */
  encodedList: Base64UrlSchema
} satisfies Shape<StatusList2021CredentialSubject>)

/**
 * StatusList2021 credential schema (V1).
 */
export const StatusList2021CredentialSchema = v.strictObject({
  ...BaseCredentialSchema.entries,

  /** JSON-LD context (V1 + StatusList2021) */
  "@context": jsonLdContextSchema([vcV1CoreContext, statusList2021Context]),

  /** Credential types */
  type: v.pipe(
    vcTypeSchema("StatusList2021Credential"),
    v.custom<["VerifiableCredential", "StatusList2021Credential"]>(() => true)
  ),

  /** Issuance date (V1) */
  issuanceDate: v.pipe(v.string(), v.isoTimestamp()),

  /** Expiration date (V1) */
  expirationDate: v.optional(v.pipe(v.string(), v.isoTimestamp())),

  /** Credential subject */
  credentialSubject: StatusList2021CredentialSubjectSchema
} satisfies Shape<StatusList2021Credential>)
