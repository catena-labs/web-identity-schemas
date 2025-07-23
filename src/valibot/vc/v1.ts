import type { CredentialV1, Uri } from "../../types"
import * as v from "valibot"
import { vcV1CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import {
  BaseCredentialSchema,
  credentialTypeSchema,
  CredentialSubjectSchema,
  makeVerifiable
} from "./core"

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
 * Generic V1 credential schema (unsigned) that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createCredentialV1Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  v.pipe(
    v.looseObject({
      ...BaseCredentialSchema.entries,

      /** JSON-LD context (V1) */
      "@context": jsonLdContextSchema(
        contextSchema
          ? [vcV1CoreContext, ...[contextSchema].flat()]
          : vcV1CoreContext
      ),

      /** Credential types */
      type: credentialTypeSchema(additionalTypes),

      /** Issuance date (V1) */
      issuanceDate: v.pipe(v.string(), v.isoTimestamp()),

      /** Expiration date (V1) */
      expirationDate: v.optional(v.pipe(v.string(), v.isoTimestamp())),

      /** Credential subject */
      credentialSubject: v.union([
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ])
    }),
    v.custom<CredentialV1>(() => true)
  )

/**
 * Generic V1 verifiable credential schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV1Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  makeVerifiable(
    createCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    )
  )

/**
 * Default V1 credential schema (unsigned).
 */
export const CredentialV1Schema = createCredentialV1Schema()

/**
 * Default V1 verifiable credential schema (with required proof).
 */
export const VerifiableCredentialV1Schema = createVerifiableCredentialV1Schema()
