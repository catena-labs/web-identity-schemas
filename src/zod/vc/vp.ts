import * as z from "zod"

import { JwtStringSchema } from "../jose"
import { IdOrObjectSchema, ProofSchema } from "./core"
import { W3CCredentialSchema, VcContextSchema } from "./vc"

/**
 * Verifiable Presentation literal type value.
 * @see {@link https://www.w3.org/TR/vc-data-model/#verifiable-presentations}
 */
export const VpTypeLiteralSchema = z.literal("VerifiablePresentation")

/**
 * Relaxed Verifiable Presentation type schema that accepts both string and array formats.
 */
export const VpTypeSchema = vpTypeSchema()

/**
 * Creates a presentation type schema that accepts a specific presentation type or array of types.
 * @param types The expected type value(s)
 */
export function vpTypeSchema<TTypes extends string | string[]>(types?: TTypes) {
  if (types) {
    if (typeof types === "string") {
      return z.tuple([z.literal(types)]).rest(z.string())
    } else {
      if (types.length === 0) {
        return z.never()
      } else if (types.length === 1) {
        return z.tuple([z.literal(types[0])])
      } else {
        const [first, ...rest] = types
        return z.tuple([z.literal(first), ...rest.map((t) => z.literal(t))])
      }
    }
  } else {
    return z.union([
      z.literal("VerifiablePresentation"),
      z
        .array(z.string())
        .min(1)
        .refine(
          (value) => value[0] === "VerifiablePresentation",
          "First type must be VerifiablePresentation",
        ),
    ])
  }
}

/**
 * Presentation schema (unsigned, no proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const PresentationSchema = z.object({
  /** JSON-LD context */
  "@context": z.union([VcContextSchema, z.array(VcContextSchema)]),

  /** Presentation identifier */
  id: z.string().optional(),

  /** Presentation type */
  type: vpTypeSchema(),

  /** Presentation holder */
  holder: IdOrObjectSchema.optional(),

  /** Verifiable credentials (credential objects or enveloped JWT strings) */
  verifiableCredential: z
    .union([
      W3CCredentialSchema,
      JwtStringSchema,
      z.array(z.union([W3CCredentialSchema, JwtStringSchema])),
    ])
    .optional(),
})

/**
 * Alias for {@link vpTypeSchema}, kept for naming parity with prior releases.
 * @deprecated Use {@link vpTypeSchema} instead.
 */
export const presentationTypeSchema = vpTypeSchema

/**
 * Verifiable Presentation schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const VerifiablePresentationSchema = PresentationSchema.extend({
  /** Proof (required for verifiable presentations) */
  proof: z.union([ProofSchema, z.array(ProofSchema)]),
})
