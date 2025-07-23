import type { ArrayContaining } from "../../types"
import type { JwsString } from "../../types/jose/jws"
import type { ProofPurpose, Proof } from "../../types/vc/proof"
import type { Shape } from "../shared/shape"
import * as v from "valibot"
import {
  proofPurposes,
  credentialStatusTypes,
  statusPurposes
} from "../../constants/vc"
import {
  type CredentialStatusType,
  type StatusPurpose,
  type CredentialStatus,
  type CredentialSchemaType,
  type CredentialSubject,
  type IdOrObject,
  type GenericResource,
  type Verifiable
} from "../../types/vc/core"
import { JwsStringSchema } from "../jose/jws"
import { DateTimeStampSchema } from "../shared/json-ld"
import { UriSchema } from "../shared/uri"
import { includesAll, oneOrMany } from "../shared/utils"

/**
 * Verifiable Credential type values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
export const VcTypeLiteralSchema = v.literal("VerifiableCredential")

/**
 * Generate a Credential type schema that will require "VerifiableCredential" as
 * a type, as well as any other required types provided. Additional strings are
 * always allowed.
 *
 * If no additional types are provided, it accepts either a single
 * VerifiableCredential string or an array containing VerifiableCredential and
 * other strings.
 *
 * If additional types are provided, it only accepts an array containing
 * VerifiableCredential, all additional types, and any other strings.
 */
export function credentialTypeSchema<
  TAdditionalTypes extends string | readonly string[] = never
>(additionalTypes?: TAdditionalTypes) {
  const requiredTypes = additionalTypes
    ? ["VerifiableCredential", ...[additionalTypes].flat()]
    : ["VerifiableCredential"]

  return v.pipe(
    oneOrMany(v.string()),
    includesAll(requiredTypes),
    v.custom<
      ArrayContaining<
        [
          "VerifiableCredential",
          ...(TAdditionalTypes extends readonly string[]
            ? TAdditionalTypes
            : TAdditionalTypes extends string
              ? [TAdditionalTypes]
              : never)
        ],
        string
      >
    >(() => true)
  )
}

/**
 * Relaxed Verifiable Credential type schema that accepts both string and array formats.
 */
export const VcTypeSchema = credentialTypeSchema()

/**
 * Proof purpose values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#proofs-signatures}
 */
export const ProofPurposeSchema = v.pipe(
  v.union([
    v.picklist(proofPurposes),
    v.string() // Allow custom proof purposes
  ]),
  v.custom<ProofPurpose>(() => true)
)

/**
 * Proof schema for verifiable credentials and presentations.
 * @see {@link https://www.w3.org/TR/vc-data-model/#proofs-signatures}
 */
export const ProofSchema = v.object({
  /** Proof type */
  type: v.string(),

  /** Creation timestamp */
  created: v.optional(DateTimeStampSchema),

  /** Verification method */
  verificationMethod: UriSchema,

  /** Proof purpose */
  proofPurpose: ProofPurposeSchema,

  /** Challenge (for presentations) */
  challenge: v.optional(v.string()),

  /** Domain (for presentations) */
  domain: v.optional(v.union([v.string(), v.array(v.string())])),

  /** Nonce */
  nonce: v.optional(v.string()),

  /** JWS signature (for JsonWebSignature2020) */
  jws: v.optional(
    v.pipe(
      JwsStringSchema,
      v.custom<JwsString>(() => true)
    )
  ),

  /** Signature value (for other proof types) */
  signatureValue: v.optional(v.string()),

  /** Proof value (generic) */
  proofValue: v.optional(v.string())
} satisfies Shape<Proof>)

/**
 * Credential status types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export const CredentialStatusTypeSchema = v.pipe(
  v.union([
    v.picklist(credentialStatusTypes),
    v.string() // Allow custom status types
  ]),
  v.custom<CredentialStatusType>(() => true)
)

/**
 * Credential status schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export const CredentialStatusSchema = v.object({
  /** Status entry identifier */
  id: v.optional(v.string()),

  /** Status type */
  type: CredentialStatusTypeSchema,

  /** Status list credential */
  statusListCredential: v.optional(v.string()),

  /** Status list index */
  statusListIndex: v.optional(v.union([v.string(), v.number()])),

  /** Status purpose */
  statusPurpose: v.optional(
    v.pipe(
      v.union([v.picklist(statusPurposes), v.string()]),
      v.custom<StatusPurpose>(() => true)
    )
  )
} satisfies Shape<CredentialStatus>)

/**
 * Credential schema reference.
 * @see {@link https://www.w3.org/TR/vc-data-model/#data-schemas}
 */
export const CredentialSchemaTypeSchema = v.object({
  /** Schema identifier */
  id: UriSchema,

  /** Schema type */
  type: v.string()
} satisfies Shape<CredentialSchemaType>)

/**
 * Generic resource schema for evidence, refresh services, and terms of use.
 * @see {@link https://www.w3.org/TR/vc-data-model/}
 */
export const GenericResourceSchema = v.object({
  /** Resource identifier (optional) */
  id: v.optional(v.union([UriSchema, v.string()])),

  /** Resource type */
  type: v.union([v.string(), v.array(v.string())])
} satisfies Shape<GenericResource>)

/**
 * ID or object schema for issuer, holder, etc.
 */
export const IdOrObjectSchema = v.pipe(
  v.union([
    UriSchema,
    v.object({
      id: UriSchema
    })
  ]),
  v.custom<IdOrObject>(() => true)
)

/**
 * Credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credential-subject}
 */
export const CredentialSubjectSchema = v.pipe(
  v.looseObject({
    /** Subject identifier (optional) */
    id: v.optional(v.union([UriSchema, v.string()]))
  }),
  v.custom<CredentialSubject>(() => true)
)

/**
 * Base W3C credential schema without proof (unsigned credential).
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const BaseCredentialSchema = v.looseObject({
  /** Credential identifier (optional) */
  id: v.optional(UriSchema),

  /** Credential types (must include VerifiableCredential) */
  type: credentialTypeSchema(),

  /** Credential issuer */
  issuer: IdOrObjectSchema,

  /** Credential status (optional) */
  credentialStatus: v.optional(
    v.union([CredentialStatusSchema, v.array(CredentialStatusSchema)])
  ),

  /** Credential schema (optional) */
  credentialSchema: v.optional(
    v.union([CredentialSchemaTypeSchema, v.array(CredentialSchemaTypeSchema)])
  ),

  /** Credential subject */
  credentialSubject: v.union([
    CredentialSubjectSchema,
    v.array(CredentialSubjectSchema)
  ]),

  /** Evidence (optional) */
  evidence: v.optional(
    v.union([GenericResourceSchema, v.array(GenericResourceSchema)])
  ),

  /** Refresh service (optional) */
  refreshService: v.optional(
    v.union([GenericResourceSchema, v.array(GenericResourceSchema)])
  ),

  /** Terms of use (optional) */
  termsOfUse: v.optional(
    v.union([GenericResourceSchema, v.array(GenericResourceSchema)])
  )
})

/**
 * Makes any credential schema verifiable by adding a required proof field.
 * @param credentialSchema The unsigned credential schema to make verifiable
 * @returns Schema that requires proof field
 */
export function makeVerifiable<
  TSchema extends v.LooseObjectSchema<
    v.ObjectEntries,
    v.ErrorMessage<v.LooseObjectIssue> | undefined
  >
>(schema: TSchema) {
  return v.pipe(
    v.looseObject({
      ...schema.entries,
      proof: v.union([ProofSchema, v.array(ProofSchema)])
    }),
    v.custom<Verifiable<v.InferOutput<TSchema>>>(() => true)
  )
}
