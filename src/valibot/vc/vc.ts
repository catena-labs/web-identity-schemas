import type { Uri } from "../../types"
import * as v from "valibot"
import { CredentialSubjectSchema } from "./core"
import {
  createCredentialV1Schema,
  createVerifiableCredentialV1Schema,
  createSignedVerifiableCredentialV1Schema,
  VcV1ContextSchema
} from "./v1"
import {
  createCredentialV2Schema,
  createVerifiableCredentialV2Schema,
  createSignedVerifiableCredentialV2Schema,
  VcV2ContextSchema
} from "./v2"

/**
 * Verifiable Credential context values (union of V1 and V2).
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const VcContextSchema = v.union([VcV1ContextSchema, VcV2ContextSchema])

/**
 * Default credential schema (unsigned, discriminated union of V1 and V2).
 */
export const createCredentialSchema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  v.union([
    createCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    ),
    createCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    )
  ])

/**
 * Default verifiable credential schema (with optional proof, discriminated union of V1 and V2).
 */
export const createVerifiableCredentialSchema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  v.union([
    createVerifiableCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    ),
    createVerifiableCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    )
  ])

/**
 * Default signed verifiable credential schema (with required proof, discriminated union of V1 and V2).
 */
export const createSignedVerifiableCredentialSchema = (
  credentialSubjectSchema: v.GenericSchema = CredentialSubjectSchema,
  additionalTypes?: string | string[],
  contextSchema?: Uri | Uri[]
) =>
  v.union([
    createSignedVerifiableCredentialV1Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    ),
    createSignedVerifiableCredentialV2Schema(
      credentialSubjectSchema,
      additionalTypes,
      contextSchema
    )
  ])

export const W3CCredentialSchema = createCredentialSchema()
export const VerifiableCredentialSchema = createVerifiableCredentialSchema()
export const SignedVerifiableCredentialSchema =
  createSignedVerifiableCredentialSchema()
