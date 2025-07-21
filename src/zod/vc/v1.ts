import type { Uri } from "../../types"
import type { Shape } from "../shared/shape"
import * as z from "zod"
import { vcV1CoreContext } from "../../constants/vc"
import { jsonLdContextSchema } from "../shared/json-ld"
import { BaseCredentialSchema, ProofSchema, credentialTypeSchema } from "./core"

/**
 * Core VC Data Model V1 context.
 * @see {@link https://www.w3.org/TR/vc-data-model-1.1/#contexts}
 */
export const VcV1CoreContextSchema = z.literal(vcV1CoreContext)

/**
 * V1 context schema: requires V1 core context + allows additional contexts.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcV1ContextSchema: Shape<string | string[]> = z.union([
  VcV1CoreContextSchema,
  z
    .array(z.string())
    .nonempty()
    .refine(
      (contexts) => contexts.includes(vcV1CoreContext),
      "Array must contain V1 core context"
    )
])

export const createVerifiableCredentialV1Schema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: z.ZodType,
  contextSchema?: Uri | Uri[]
) =>
  BaseCredentialSchema.extend({
    /** JSON-LD context (V1) */
    "@context": contextSchema
      ? jsonLdContextSchema(contextSchema)
      : z.union([VcV1ContextSchema, z.array(VcV1ContextSchema)]),

    /** Credential types */
    type: credentialTypeSchema(additionalTypes),

    /** Issuance date (V1) */
    issuanceDate: z.iso.datetime(),

    /** Expiration date (V1) */
    expirationDate: z.iso.datetime().optional(),

    /** Credential subject */
    credentialSubject:
      credentialSubjectSchema ?? z.object({ id: z.string().optional() })
  }).strict()

/**
 * Create a signed V1 verifiable credential schema.
 * @param credentialSubjectSchema - The schema for the credential subject.
 * @returns The signed V1 verifiable credential schema.
 * @see {@link createVerifiableCredentialV1Schema}
 */
export const createSignedVerifiableCredentialV1Schema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: z.ZodType,
  contextSchema?: Uri | Uri[]
) =>
  createVerifiableCredentialV1Schema(
    additionalTypes,
    credentialSubjectSchema,
    contextSchema
  ).extend({
    proof: ProofSchema
  })

/**
 * Default V1 verifiable credential schema.
 */
export const VerifiableCredentialV1Schema = createVerifiableCredentialV1Schema()
