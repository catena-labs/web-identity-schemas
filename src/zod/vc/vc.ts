import * as z from "zod"

import type { Uri } from "../../types"
import { CredentialSubjectSchema } from "./core"
import {
  createCredentialV1Schema,
  createVerifiableCredentialV1Schema,
  VcV1ContextSchema,
} from "./v1"
import {
  createCredentialV2Schema,
  createVerifiableCredentialV2Schema,
  VcV2ContextSchema,
} from "./v2"

/**
 * Verifiable Credential context values (union of V1 and V2).
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcContextSchema = z.union([VcV1ContextSchema, VcV2ContextSchema])

/**
 * Default credential schema (unsigned, discriminated union of V1 and V2).
 */
export const createCredentialSchema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[],
) =>
  z.union([
    createCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema,
    ),
    createCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema,
    ),
  ])

/**
 * Default verifiable credential schema (with required proof, discriminated union of V1 and V2).
 */
export const createVerifiableCredentialSchema = (
  credentialSubjectSchema: z.ZodType = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[],
) =>
  z.union([
    createVerifiableCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema,
    ),
    createVerifiableCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema,
    ),
  ])

export const W3CCredentialSchema = createCredentialSchema()
export const VerifiableCredentialSchema = createVerifiableCredentialSchema()
