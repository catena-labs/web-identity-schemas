import * as v from "valibot"
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
 * Verifiable Credential type values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#types}
 */
export const VcTypeLiteralSchema = v.literal("VerifiableCredential")

export const vcTypeSchema = (additionalTypes?: string | string[]) => {
  if (additionalTypes) {
    return v.tuple([
      VcTypeLiteralSchema,
      ...[additionalTypes].flat().map((t) => v.literal(t))
    ])
  } else {
    return v.pipe(
      v.union([
        VcTypeLiteralSchema,
        v.tuple([VcTypeLiteralSchema]),
        v.pipe(
          v.array(v.string()),
          v.minLength(1),
          v.check(
            (types) => types[0] === "VerifiableCredential",
            "First type must be VerifiableCredential"
          )
        )
      ]),
      v.transform((input) => (typeof input === "string" ? [input] : input)),
      v.custom<
        ["VerifiableCredential"] | ["VerifiableCredential", ...string[]]
      >(() => true)
    )
  }
}

/**
 * Relaxed Verifiable Credential type schema that accepts both string and array formats.
 */
export const VcTypeSchema = vcTypeSchema()

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
export const CredentialSchemaSchema = v.object({
  /** Schema identifier */
  id: UriSchema,

  /** Schema type */
  type: v.string()
} satisfies Shape<CredentialSchema>)

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
  v.object({
    /** Subject identifier (optional) */
    id: v.optional(v.union([UriSchema, v.string()]))
  }),
  v.custom<CredentialSubject>(() => true)
)

/**
 * Base credential schema with common fields.
 * @see {@link https://www.w3.org/TR/vc-data-model/#credentials}
 */
export const BaseCredentialSchema = v.object({
  /** Credential identifier (optional) */
  id: v.optional(UriSchema),

  /** Credential types (must include VerifiableCredential) */
  type: vcTypeSchema(),

  /** Credential issuer */
  issuer: IdOrObjectSchema,

  /** Credential status (optional) */
  credentialStatus: v.optional(
    v.union([CredentialStatusSchema, v.array(CredentialStatusSchema)])
  ),

  /** Credential schema (optional) */
  credentialSchema: v.optional(
    v.union([CredentialSchemaSchema, v.array(CredentialSchemaSchema)])
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
  ),

  /** Proof (optional) */
  proof: v.optional(v.union([ProofSchema, v.array(ProofSchema)]))
})
