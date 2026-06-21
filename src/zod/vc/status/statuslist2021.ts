import * as z from "zod"

import {
  statusList2021Context,
  statusPurposes,
  vcV1CoreContext,
} from "../../../constants/vc"
import type {
  StatusList2021CredentialSubject,
  StatusList2021Credential,
} from "../../../types/vc/status/statuslist2021"
import { Base64UrlSchema } from "../../shared/base-64"
import { jsonLdContextSchema } from "../../shared/json-ld"
import type { Shape } from "../../shared/shape"
import { UriSchema } from "../../shared/uri"
import { BaseCredentialSchema, credentialTypeSchema } from "../core"

/**
 * StatusList2021 context (for V1 credentials).
 * @see {@link https://w3c.github.io/vc-status-list-2021/}
 */
export const StatusList2021ContextSchema = z.literal(statusList2021Context)

/**
 * StatusList2021 credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-status-list/#statuslist2021credential}
 */
export const StatusList2021CredentialSubjectSchema: Shape<StatusList2021CredentialSubject> =
  z.object({
    /** Credential subject identifier (URL per spec, not restricted to DIDs) */
    id: UriSchema.optional(),

    /** Type of the credential subject */
    type: z.literal("StatusList2021"),

    /** Purpose of the status list (revocation or suspension) */
    statusPurpose: z.enum(statusPurposes),

    /** Base64url-encoded status list */
    encodedList: Base64UrlSchema,
  })

/**
 * StatusList2021 credential schema (V1).
 */
export const StatusList2021CredentialSchema: Shape<StatusList2021Credential> =
  BaseCredentialSchema.extend({
    /** JSON-LD context (V1 + StatusList2021) */
    "@context": jsonLdContextSchema([vcV1CoreContext, statusList2021Context]),

    /** Credential types */
    type: credentialTypeSchema("StatusList2021Credential"),

    /** Issuance date (V1) */
    issuanceDate: z.iso.datetime(),

    /** Expiration date (V1) */
    expirationDate: z.iso.datetime().optional(),

    /** Credential subject */
    credentialSubject: StatusList2021CredentialSubjectSchema,
  }).loose()
