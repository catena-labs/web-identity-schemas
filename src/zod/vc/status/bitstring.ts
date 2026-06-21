import * as z from "zod"

import {
  bitstringStatusListContext,
  statusPurposes,
  vcV2CoreContext,
} from "../../../constants/vc"
import type {
  BitstringStatusListCredentialSubject,
  BitstringStatusListCredential,
} from "../../../types/vc/status/bitstring"
import { Base64UrlSchema } from "../../shared/base-64"
import { jsonLdContextSchema } from "../../shared/json-ld"
import type { Shape } from "../../shared/shape"
import { UriSchema } from "../../shared/uri"
import { BaseCredentialSchema, credentialTypeSchema } from "../core"

/**
 * BitstringStatusList context (for V2 credentials).
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/}
 */
export const BitstringStatusListContextSchema = z.literal(
  bitstringStatusListContext,
)

/**
 * BitstringStatusList credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/#bitstringstatuslistcredential}
 */
export const BitstringStatusListCredentialSubjectSchema: Shape<BitstringStatusListCredentialSubject> =
  z.object({
    /** Credential subject identifier (URL per spec, not restricted to DIDs) */
    id: UriSchema.optional(),

    /** Type of the credential subject */
    type: z.literal("BitstringStatusList"),

    /** Purpose of the status list (revocation or suspension) */
    statusPurpose: z.enum(statusPurposes),

    /** Base64url-encoded status list */
    encodedList: Base64UrlSchema,

    /** Time to live for the status list in seconds */
    ttl: z.number().optional(),
  })

/**
 * BitstringStatusList credential schema (V2).
 */
export const BitstringStatusListCredentialSchema: Shape<BitstringStatusListCredential> =
  BaseCredentialSchema.extend({
    /** JSON-LD context (V2 + BitstringStatusList) */
    "@context": jsonLdContextSchema([
      vcV2CoreContext,
      bitstringStatusListContext,
    ]),

    /** Credential types */
    type: credentialTypeSchema("BitstringStatusListCredential"),

    /** Valid from date (V2) */
    validFrom: z.iso.datetime().optional(),

    /** Valid until date (V2) */
    validUntil: z.iso.datetime().optional(),

    /** Credential subject */
    credentialSubject: BitstringStatusListCredentialSubjectSchema,
  }).loose()
