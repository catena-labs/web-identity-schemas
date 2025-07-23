import type { Uri } from "../../types"
import * as v from "valibot"
import { vcV1CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import {
  BaseCredentialSchema,
  vcTypeSchema,
  ProofSchema,
  CredentialSubjectSchema
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ])
    }),
    v.custom(() => true)
  )

/**
 * Generic V1 verifiable credential schema (with optional proof) that accepts credential type, subject, and context types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createVerifiableCredentialV1Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ]),

      /** Proof (optional) */
      proof: v.optional(v.union([ProofSchema, v.array(ProofSchema)]))
    }),
    v.custom(() => true)
  )

/**
 * Generic V1 signed verifiable credential schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const createSignedVerifiableCredentialV1Schema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
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
        credentialSubjectSchema,
        v.array(credentialSubjectSchema)
      ]),

      /** Proof (required) */
      proof: v.union([ProofSchema, v.array(ProofSchema)])
    }),
    v.custom(() => true)
  )

/**
 * Default V1 credential schema (unsigned).
 */
export const CredentialV1Schema = createCredentialV1Schema()

/**
 * Default V1 verifiable credential schema (with optional proof).
 */
export const VerifiableCredentialV1Schema = createVerifiableCredentialV1Schema()

/**
 * Default V1 signed verifiable credential schema (with required proof).
 */
export const SignedVerifiableCredentialV1Schema =
  createSignedVerifiableCredentialV1Schema()
