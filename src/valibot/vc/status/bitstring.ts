import type {
  BitstringStatusListCredentialSubject,
  BitstringStatusListCredential
} from "../../../types/vc/status/bitstring"
import type { Shape } from "../../shared/shape"
import * as v from "valibot"
import {
  bitstringStatusListContext,
  statusPurposes,
  vcV2CoreContext
} from "../../../constants/vc"
import { DidSchema } from "../../did"
import { Base64UrlSchema } from "../../shared/base-64"
import { jsonLdContextSchema } from "../../shared/json-ld"
import { BaseCredentialSchema, vcTypeSchema } from "../core"

/**
 * BitstringStatusList context (for V2 credentials).
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/}
 */
export const BitstringStatusListContextSchema = v.literal(
  bitstringStatusListContext
)

/**
 * BitstringStatusList credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/#bitstringstatuslistcredential}
 */
export const BitstringStatusListCredentialSubjectSchema = v.object({
  /** Credential subject identifier */
  id: v.optional(DidSchema),

  /** Type of the credential subject */
  type: v.literal("BitstringStatusList"),

  /** Purpose of the status list (revocation or suspension) */
  statusPurpose: v.picklist(statusPurposes),

  /** Base64url-encoded status list */
  encodedList: Base64UrlSchema,

  /** Time to live for the status list in seconds */
  ttl: v.optional(v.number())
} satisfies Shape<BitstringStatusListCredentialSubject>)

/**
 * BitstringStatusList credential schema (V2).
 */
export const BitstringStatusListCredentialSchema = v.strictObject({
  ...BaseCredentialSchema.entries,

  /** JSON-LD context (V2 + BitstringStatusList) */
  "@context": jsonLdContextSchema([
    vcV2CoreContext,
    bitstringStatusListContext
  ]),

  /** Credential types */
  type: v.pipe(
    vcTypeSchema("BitstringStatusListCredential"),
    v.custom<["VerifiableCredential", "BitstringStatusListCredential"]>(
      () => true
    )
  ),

  /** Valid from date (V2) */
  validFrom: v.optional(v.pipe(v.string(), v.isoTimestamp())),

  /** Valid until date (V2) */
  validUntil: v.optional(v.pipe(v.string(), v.isoTimestamp())),

  /** Credential subject */
  credentialSubject: BitstringStatusListCredentialSubjectSchema
} satisfies Shape<BitstringStatusListCredential>)
