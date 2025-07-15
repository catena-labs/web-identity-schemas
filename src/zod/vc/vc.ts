import * as z from "zod"
import { createVerifiableCredentialV1Schema, VcV1ContextSchema } from "./v1"
import { createVerifiableCredentialV2Schema, VcV2ContextSchema } from "./v2"

/**
 * Verifiable Credential context values (union of V1 and V2).
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcContextSchema = z.union([VcV1ContextSchema, VcV2ContextSchema])

/**
 * Default verifiable credential schema (discriminated union of V1 and V2).
 */
export const createVerifiableCredentialSchema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: z.ZodType
) =>
  z.union([
    createVerifiableCredentialV1Schema(
      additionalTypes,
      credentialSubjectSchema
    ),
    createVerifiableCredentialV2Schema(additionalTypes, credentialSubjectSchema)
  ])

export const VerifiableCredentialSchema = createVerifiableCredentialSchema()
