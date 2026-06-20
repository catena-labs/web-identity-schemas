import * as z from "zod"

import { vcV1CoreContext } from "../../constants/vc"
import type { Uri } from "../../types"
import { DateTimeStampSchema, jsonLdContextSchema } from "../shared/json-ld"
import type { Shape } from "../shared/shape"
import {
  BaseCredentialSchema,
  makeVerifiable,
  credentialTypeSchema,
  CredentialSubjectSchema,
} from "./core"

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
      (contexts) => contexts[0] === vcV1CoreContext,
      "First context must be the V1 core context",
    ),
])

export const createCredentialV1Schema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[],
) =>
  BaseCredentialSchema.extend({
    /** JSON-LD context (V1) */
    "@context": jsonLdContextSchema(
      contextSchema
        ? [vcV1CoreContext, ...[contextSchema].flat()]
        : vcV1CoreContext,
    ),

    /** Credential types */
    type: credentialTypeSchema(additionalTypes),

    /** Issuance date (V1) */
    issuanceDate: DateTimeStampSchema,

    /** Expiration date (V1) */
    expirationDate: DateTimeStampSchema.optional(),

    /** Credential subject */
    credentialSubject: z.union([
      credentialSubjectSchema,
      z.array(credentialSubjectSchema),
    ]),
  }).loose()

export const createVerifiableCredentialV1Schema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[],
) =>
  makeVerifiable(
    createCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema,
    ),
  )

/**
 * Default V1 credential schema (unsigned).
 */
export const CredentialV1Schema = createCredentialV1Schema()

/**
 * Default V1 verifiable credential schema (with required proof).
 */
export const VerifiableCredentialV1Schema = createVerifiableCredentialV1Schema()
