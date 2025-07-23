import type { StatusList2021CredentialSubject } from "../../../types/vc/status/statuslist2021"
import type { Shape } from "../../shared/shape"
import * as z from "zod"
import {
  statusList2021Context,
  statusPurposes,
  vcV1CoreContext
} from "../../../constants/vc"
import { DidSchema } from "../../did"
import { Base64UrlSchema } from "../../shared/base-64"
import { BaseCredentialSchema, ProofSchema } from "../core"
import { VcV1CoreContextSchema } from "../v1"

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
    /** Credential subject identifier */
    id: DidSchema.optional(),

    /** Type of the credential subject */
    type: z.literal("StatusList2021"),

    /** Purpose of the status list (revocation or suspension) */
    statusPurpose: z.enum(statusPurposes),

    /** Base64url-encoded status list */
    encodedList: Base64UrlSchema
  })

/**
 * StatusList2021 context schema: requires V1 core context + StatusList2021 context.
 */
const StatusList2021CredentialContextSchema = z.union([
  z.tuple([VcV1CoreContextSchema, StatusList2021ContextSchema]),
  z
    .array(z.string())
    .nonempty()
    .refine(
      (contexts) =>
        contexts.includes(vcV1CoreContext) &&
        contexts.includes(statusList2021Context),
      "Array must contain both V1 core context and StatusList2021 context"
    )
])

/**
 * StatusList2021 credential schema (V1).
 */
export const StatusList2021CredentialSchema = BaseCredentialSchema.extend({
  /** JSON-LD context (V1 + StatusList2021) */
  "@context": StatusList2021CredentialContextSchema,

  /** Issuance date (V1) */
  issuanceDate: z.iso.datetime(),

  /** Expiration date (V1) */
  expirationDate: z.iso.datetime().optional(),

  /** Credential subject */
  credentialSubject: StatusList2021CredentialSubjectSchema,

  /** Proof (optional) */
  proof: z.union([ProofSchema, z.array(ProofSchema)]).optional()
}).strict()
