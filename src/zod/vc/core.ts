import * as z from "zod"
import { UriSchema } from "../shared/uri"
import { DateTimeStampSchema } from "../shared/json-ld"
import { JwsStringSchema } from "../jose/jws"
import type { JwsString } from "../../types/jose/jws"
import {
  proofPurposes,
  credentialStatusTypes,
  statusPurposes
} from "../../constants/vc"
import type { Shape } from "../shared/shape"
import type {
  CredentialStatusType,
  StatusPurpose,
  CredentialStatus,
  CredentialSchema,
  CredentialSubject,
  IdOrObject,
  GenericResource
} from "../../types/vc/core"
import type { ProofPurpose, Proof } from "../../types/vc/proof"

/**
 * Verifiable Credential literal type value.
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
export const VcTypeLiteralSchema = z.literal("VerifiableCredential")

/**
 * Relaxed Verifiable Credential type schema that accepts both string and array formats.
 */
export const VcTypeSchema = credentialTypeSchema()

/**
 * Creates a type schema that ensures "VerifiableCredential" is always the first type.
 * @param additionalTypes Additional types to append after "VerifiableCredential"
 */
export function credentialTypeSchema(additionalTypes?: string | string[]) {
  if (additionalTypes) {
    if (typeof additionalTypes === "string") {
      return z.tuple([VcTypeLiteralSchema, z.literal(additionalTypes)])
    } else {
      return z.tuple([
        VcTypeLiteralSchema,
        ...additionalTypes.map((t) => z.literal(t))
      ])
    }
  } else {
    return z
      .union([
        VcTypeLiteralSchema,
        z.tuple([VcTypeLiteralSchema]),
        z
          .array(z.string())
          .min(1)
          .refine(
            (types) => types[0] === "VerifiableCredential",
            "First type must be VerifiableCredential"
          )
      ])
      .transform((input) => {
        if (typeof input === "string") {
          return [input] as ["VerifiableCredential"]
        }
        return input as ["VerifiableCredential", ...string[]]
      })
  }
}

/**
 * Proof purpose values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#proofs-signatures}
 */
export const ProofPurposeSchema = z
  .union([z.enum(proofPurposes), z.string()])
  .pipe(z.custom<ProofPurpose>())

/**
 * Proof schema for verifiable credentials and presentations.
 * @see {@link https://www.w3.org/TR/vc-data-model/#proofs-signatures}
 */
export const ProofSchema: Shape<Proof> = z.object({
  /** Proof type */
  type: z.string(),

  /** Creation timestamp */
  created: DateTimeStampSchema.optional(),

  /** Verification method */
  verificationMethod: UriSchema,

  /** Proof purpose */
  proofPurpose: ProofPurposeSchema,

  /** Challenge (for presentations) */
  challenge: z.string().optional(),

  /** Domain (for presentations) */
  domain: z.union([z.string(), z.array(z.string())]).optional(),

  /** Nonce */
  nonce: z.string().optional(),

  /** JWS signature (for JsonWebSignature2020) */
  jws: z
    .custom<JwsString>((val) => JwsStringSchema.safeParse(val).success)
    .optional(),

  /** Signature value (for other proof types) */
  signatureValue: z.string().optional(),

  /** Proof value (generic) */
  proofValue: z.string().optional()
})

/**
 * Credential status types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export const CredentialStatusTypeSchema = z
  .union([
    z.enum(credentialStatusTypes),
    z.string() // Allow custom status types
  ])
  .pipe(z.custom<CredentialStatusType>())

/**
 * Credential status schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export const CredentialStatusSchema: Shape<CredentialStatus> = z.object({
  /** Status entry identifier */
  id: z.string().optional(),

  /** Status type */
  type: CredentialStatusTypeSchema,

  /** Status list credential */
  statusListCredential: z.string().optional(),

  /** Status list index */
  statusListIndex: z.union([z.string(), z.number()]).optional(),

  /** Status purpose */
  statusPurpose: z
    .union([z.enum(statusPurposes), z.string()])
    .pipe(z.custom<StatusPurpose>())
    .optional()
})

/**
 * Credential schema reference.
 * @see {@link https://www.w3.org/TR/vc-data-model/#data-schemas}
 */
export const CredentialSchemaSchema: Shape<CredentialSchema> = z.object({
  /** Schema identifier */
  id: UriSchema,

  /** Schema type */
  type: z.string()
})

/**
 * Generic resource schema for evidence, refresh services, and terms of use.
 * @see {@link https://www.w3.org/TR/vc-data-model/}
 */
export const GenericResourceSchema: Shape<GenericResource> = z.object({
  /** Resource identifier (optional) */
  id: z.union([UriSchema, z.string()]).optional(),

  /** Resource type */
  type: z.union([z.string(), z.array(z.string())])
})

/**
 * ID or object schema for issuer, holder, etc.
 */
export const IdOrObjectSchema: Shape<IdOrObject> = z.union([
  UriSchema,
  z.object({
    id: UriSchema
  })
])

/**
 * Credential subject schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credential-subject}
 */
export const CredentialSubjectSchema: Shape<CredentialSubject> = z.object({
  /** Subject identifier (optional) */
  id: z.union([UriSchema, z.string()]).optional()
})

/**
 * Base credential schema with common fields.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const BaseCredentialSchema = z.object({
  /** Credential identifier (optional) */
  id: UriSchema.optional(),

  /** Credential types (must include VerifiableCredential) */
  type: credentialTypeSchema(),

  /** Credential issuer */
  issuer: IdOrObjectSchema,

  /** Credential status (optional) */
  credentialStatus: z
    .union([CredentialStatusSchema, z.array(CredentialStatusSchema)])
    .optional(),

  /** Credential schema (optional) */
  credentialSchema: z
    .union([CredentialSchemaSchema, z.array(CredentialSchemaSchema)])
    .optional(),

  /** Credential subject */
  credentialSubject: z.union([
    CredentialSubjectSchema,
    z.array(CredentialSubjectSchema)
  ]),

  /** Evidence (optional) */
  evidence: z
    .union([GenericResourceSchema, z.array(GenericResourceSchema)])
    .optional(),

  /** Refresh service (optional) */
  refreshService: z
    .union([GenericResourceSchema, z.array(GenericResourceSchema)])
    .optional(),

  /** Terms of use (optional) */
  termsOfUse: z
    .union([GenericResourceSchema, z.array(GenericResourceSchema)])
    .optional(),

  /** Proof (optional) */
  proof: z.union([ProofSchema, z.array(ProofSchema)]).optional()
})
