import type { Uri } from "../../types"
import * as v from "valibot"
import { vcV2CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import {
  BaseCredentialSchema,
  vcTypeSchema,
  ProofSchema,
  CredentialSubjectSchema
} from "./core"

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
    v.tupleWithRest([VcV2CoreCntextSchema], v.string()),
    v.check(
      (contexts) => contexts.includes(vcV2CoreContext),
      "Array must contain V2 core context"
    )
  )
])

/**
 * Generic V2 credential schema (unsigned) that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createCredentialV2Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ])
    }),
    v.custom(() => true)
  )

/**
 * Generic V2 verifiable credential schema (with optional proof) that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV2Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ]),

      /** Proof (optional) */
      proof: v.optional(v.union([ProofSchema, v.array(ProofSchema)]))
    }),
    v.custom(() => true)
  )

/**
 * Generic V2 signed verifiable credential schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createSignedVerifiableCredentialV2Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ]),

      /** Proof (required) */
      proof: v.union([ProofSchema, v.array(ProofSchema)])
    }),
    v.custom(() => true)
  )

/**
 * Default V2 credential schema (unsigned).
 */
export const CredentialV2Schema = createCredentialV2Schema()

/**
 * Default V2 verifiable credential schema (with optional proof).
 */
export const VerifiableCredentialV2Schema = createVerifiableCredentialV2Schema()

/**
 * Default V2 signed verifiable credential schema (with required proof).
 */
export const SignedVerifiableCredentialV2Schema =
  createSignedVerifiableCredentialV2Schema()
