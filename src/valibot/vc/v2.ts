import * as v from "valibot"
import { BaseCredentialSchema, vcTypeSchema } from "./core"
import { vcV2CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import type { Uri } from "../../types"

/**
 * Core VC Data Model V2 context.
 * @see {@link https://www.w3.org/TR/vc-data-model-2.0/#contexts}
 */
export const VcV2CoreContextSchema = v.literal(vcV2CoreContext)

/**
 * V2 context schema: requires V2 core context + allows additional contexts.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcV2ContextSchema = v.union([
  VcV2CoreContextSchema,
  v.pipe(
    v.tupleWithRest([VcV2CoreContextSchema], v.string()),
    v.check(
      (contexts) => contexts.includes(vcV2CoreContext),
      "Array must contain V2 core context"
    )
  )
])

/**
 * Generic V2 verifiable credential schema that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV2Schema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: v.GenericSchema,
  contextSchema?: Uri | Uri[]
) =>
  v.pipe(
    v.strictObject({
      ...BaseCredentialSchema.entries,

      /** JSON-LD context (V2) */
      "@context": jsonLdContextSchema(
        contextSchema
          ? [vcV2CoreContext, ...[contextSchema].flat()]
          : vcV2CoreContext
      ),

      /** Credential types */
      type: vcTypeSchema(additionalTypes),

      /** Valid from date (V2) */
      validFrom: v.optional(v.pipe(v.string(), v.isoTimestamp())),

      /** Valid until date (V2) */
      validUntil: v.optional(v.pipe(v.string(), v.isoTimestamp())),

      /** Credential subject */
      credentialSubject: v.union([
        credentialSubjectSchema ??
          v.looseObject({ id: v.optional(v.string()) }),
        v.array(
          credentialSubjectSchema ??
            v.looseObject({ id: v.optional(v.string()) })
        )
      ])
    }),
    v.custom(() => true)
  )

/**
 * Default V2 verifiable credential schema.
 */
export const VerifiableCredentialV2Schema = createVerifiableCredentialV2Schema()
