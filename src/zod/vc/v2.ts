import * as z from "zod"
import { BaseCredentialSchema, credentialTypeSchema } from "./core"
import { vcV2CoreContext } from "../../constants/vc"
import type { Uri } from "../../types"
import { jsonLdContextSchema } from "../shared/json-ld"

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
 * Generic V2 verifiable credential schema that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV2Schema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: z.ZodType,
  contextSchema?: Uri | Uri[]
) =>
  z
    .object({
      ...BaseCredentialSchema.shape,

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
        credentialSubjectSchema ?? z.object({ id: z.string().optional() }),
        z.array(
          credentialSubjectSchema ?? z.object({ id: z.string().optional() })
        )
      ])
    })
    .strict()

/**
 * Default V2 verifiable credential schema.
 */
export const VerifiableCredentialV2Schema = createVerifiableCredentialV2Schema()
