import type { Uri } from "../../types"
import * as v from "valibot"
import { vcV1CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import { BaseCredentialSchema, vcTypeSchema } from "./core"

/**
 * Core VC Data Model V1 context.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#contexts}
 */
export const VcV1CoreContextSchema = v.literal(vcV1CoreContext)

/**
 * V1 context schema: requires V1 core context + allows additional contexts.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcV1ContextSchema = v.union([
  VcV1CoreContextSchema,
  v.pipe(
    v.pipe(v.array(v.string()), v.nonEmpty()),
    v.check(
      (contexts) => contexts.includes(vcV1CoreContext),
      "Array must contain V1 core context"
    )
  )
])

/**
 * Generic V1 verifiable credential schema that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV1Schema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: v.GenericSchema,
  contextSchema?: Uri | Uri[]
) =>
  v.pipe(
    v.strictObject({
      ...BaseCredentialSchema.entries,

      /** JSON-LD context (V1) */
      "@context": jsonLdContextSchema(
        contextSchema
          ? [vcV1CoreContext, ...[contextSchema].flat()]
          : vcV1CoreContext
      ),

      /** Credential types */
      type: vcTypeSchema(additionalTypes),

      /** Issuance date (V1) */
      issuanceDate: v.pipe(v.string(), v.isoTimestamp()),

      /** Expiration date (V1) */
      expirationDate: v.optional(v.pipe(v.string(), v.isoTimestamp())),

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
 * Default V1 verifiable credential schema.
 */
export const VerifiableCredentialV1Schema = createVerifiableCredentialV1Schema()
