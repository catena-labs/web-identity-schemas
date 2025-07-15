import * as v from "valibot"
import { createVerifiableCredentialV1Schema, VcV1ContextSchema } from "./v1"
import { createVerifiableCredentialV2Schema, VcV2ContextSchema } from "./v2"
import type { Uri } from "../../types"

/**
 * Verifiable Credential context values (union of V1 and V2).
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcContextSchema = v.union([VcV1ContextSchema, VcV2ContextSchema])

/**
 * Default verifiable credential schema (discriminated union of V1 and V2).
 */
export const createVerifiableCredentialSchema = (
  additionalTypes?: string | string[],
  credentialSubjectSchema?: v.GenericSchema,
  contextSchema?: Uri | Uri[]
) =>
  v.union([
    createVerifiableCredentialV1Schema(
      additionalTypes,
      credentialSubjectSchema,
      contextSchema
    ),
    createVerifiableCredentialV2Schema(
      additionalTypes,
      credentialSubjectSchema,
      contextSchema
    )
  ])

export const VerifiableCredentialSchema = createVerifiableCredentialSchema()
