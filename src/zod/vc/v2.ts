import type { Uri } from "../../types"
import * as z from "zod"
import { vcV2CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import {
  BaseCredentialSchema,
  makeVerifiable,
  credentialTypeSchema,
  CredentialSubjectSchema
} from "./core"

/**
 * Core VC Data Model V2 context.
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#contexts}
 */
export const VcV2CoreContextSchema = z.literal(vcV2CoreContext)

/**
 * V2 context schema: requires V2 core context + allows additional contexts.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcV2ContextSchema = z.union([
  VcV2CoreContextSchema,
  z
    .array(z.string())
    .nonempty()
    .refine(
      (contexts) => contexts.includes(vcV2CoreContext),
      "Array must contain V2 core context"
    )
])

/**
 * Generic V2 credential schema (unsigned) that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createCredentialV2Schema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  BaseCredentialSchema.extend({
    /** JSON-LD context (V2) */
    "@context": jsonLdContextSchema(
      contextSchema
        ? [vcV2CoreContext, ...[contextSchema].flat()]
        : vcV2CoreContext
    ),

    /** Credential types */
    type: credentialTypeSchema(additionalTypes),

    /** Valid from date (V2) */
    validFrom: z.iso.datetime().optional(),

    /** Valid until date (V2) */
    validUntil: z.iso.datetime().optional(),

    /** Credential subject */
    credentialSubject: z.union([
      credentialSubjectSchema,
      z.array(credentialSubjectSchema)
    ])
  }).strict()

/**
 * Generic V2 verifiable credential schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV2Schema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  makeVerifiable(
    createCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    )
  )

/**
 * Default V2 credential schema (unsigned).
 */
export const CredentialV2Schema = createCredentialV2Schema()

/**
 * Default V2 verifiable credential schema (with required proof).
 */
export const VerifiableCredentialV2Schema = createVerifiableCredentialV2Schema()
