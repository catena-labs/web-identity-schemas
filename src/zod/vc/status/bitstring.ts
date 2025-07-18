import * as z from "zod"
import { DidSchema } from "../../did"
import { Base64UrlSchema } from "../../shared/base-64"
import { BaseCredentialSchema } from "../core"
import {
  bitstringStatusListContext,
  statusPurposes,
  vcV2CoreContext
} from "../../../constants/vc"
import { VcV2CoreContextSchema } from "../v2"
import type { BitstringStatusListCredentialSubject } from "../../../types/vc/status/bitstring"
import type { Shape } from "../../shared/shape"

/**
 * BitstringStatusList context (for V2 credentials).
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/}
 */
export const BitstringStatusListContextSchema = z.literal(
  bitstringStatusListContext
)

/**
 * BitstringStatusList credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/#bitstringstatuslistcredential}
 */
export const BitstringStatusListCredentialSubjectSchema: Shape<BitstringStatusListCredentialSubject> =
  z.object({
    /** Credential subject identifier */
    id: DidSchema.optional(),

    /** Type of the credential subject */
    type: z.literal("BitstringStatusList"),

    /** Purpose of the status list (revocation or suspension) */
    statusPurpose: z.enum(statusPurposes),

    /** Base64url-encoded status list */
    encodedList: Base64UrlSchema,

    /** Time to live for the status list in seconds */
    ttl: z.number().optional()
  })

/**
 * BitstringStatusList context schema: requires V2 core context + BitstringStatusList context.
 */
const BitstringStatusListCredentialContextSchema = z.union([
  z.tuple([VcV2CoreContextSchema, BitstringStatusListContextSchema]),
  z
    .array(z.string())
    .nonempty()
    .refine(
      (contexts) =>
        contexts.includes(vcV2CoreContext) &&
        contexts.includes(bitstringStatusListContext),
      "Array must contain both V2 core context and BitstringStatusList context"
    )
])

/**
 * BitstringStatusList credential schema (V2).
 */
export const BitstringStatusListCredentialSchema = BaseCredentialSchema.extend({
  /** JSON-LD context (V2 + BitstringStatusList) */
  "@context": BitstringStatusListCredentialContextSchema,

  /** Valid from date (V2) */
  validFrom: z.iso.datetime().optional(),

  /** Valid until date (V2) */
  validUntil: z.iso.datetime().optional(),

  /** Credential subject */
  credentialSubject: BitstringStatusListCredentialSubjectSchema
}).strict()
