import * as v from "valibot"

import { JwtStringSchema } from "../jose"
import { IdOrObjectSchema, ProofSchema } from "./core"
import { W3CCredentialSchema, VcContextSchema } from "./vc"

/**
 * Verifiable Presentation type values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#verifiable-presentations}
 */
export const VpTypeLiteralSchema = v.literal("VerifiablePresentation")

export const vpTypeSchema = (type?: string | string[]) => {
  if (type) {
    return v.tuple([
      VpTypeLiteralSchema,
      ...[type].flat().map((t) => v.literal(t)),
    ])
  } else {
    return v.union([
      VpTypeLiteralSchema,
      v.pipe(
        v.array(v.string()),
        v.minLength(1),
        v.check(
          (types) => types[0] === "VerifiablePresentation",
          "First type must be VerifiablePresentation",
        ),
      ),
    ])
  }
}

/**
 * Relaxed Verifiable Presentation type schema that accepts both string and array formats.
 */
export const VpTypeSchema = vpTypeSchema()

/**
 * Alias for {@link vpTypeSchema}, kept for naming parity with the zod module.
 * @deprecated Use {@link vpTypeSchema} instead.
 */
export const presentationTypeSchema = vpTypeSchema

/**
 * Presentation schema (unsigned, no proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const PresentationSchema = v.object({
  /** JSON-LD context */
  "@context": v.union([VcContextSchema, v.array(VcContextSchema)]),

  /** Presentation identifier */
  id: v.optional(v.string()),

  /** Presentation type */
  type: vpTypeSchema(),

  /** Presentation holder */
  holder: v.optional(IdOrObjectSchema),

  /** Verifiable credentials (credential objects or enveloped JWT strings) */
  verifiableCredential: v.optional(
    v.union([
      W3CCredentialSchema,
      JwtStringSchema,
      v.array(v.union([W3CCredentialSchema, JwtStringSchema])),
    ]),
  ),
})

/**
 * Verifiable Presentation schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const VerifiablePresentationSchema = v.object({
  ...PresentationSchema.entries,
  /** Proof (required for verifiable presentations) */
  proof: v.union([ProofSchema, v.array(ProofSchema)]),
})
