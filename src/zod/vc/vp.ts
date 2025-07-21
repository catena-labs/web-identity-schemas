import * as z from "zod"
import { DidSchema } from "../did"
import { ProofSchema } from "./core"
import { VerifiableCredentialSchema, VcContextSchema } from "./vc"

/**
 * Verifiable Presentation literal type value.
 * @see {@link https://www.w3.org/TR/vc-data-model/#verifiable-presentations}
 */
export const VpTypeLiteralSchema = z.literal("VerifiablePresentation")

/**
 * Relaxed Verifiable Presentation type schema that accepts both string and array formats.
 */
export const VpTypeSchema = presentationTypeSchema()

/**
 * Creates a presentation type schema that accepts a specific presentation type or array of types.
 * @param types The expected type value(s)
 */
export function presentationTypeSchema<TTypes extends string | string[]>(
  types?: TTypes
) {
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
          (types) => types[0] === "VerifiablePresentation",
          "First type must be VerifiablePresentation"
        )
    ])
  }
}

/**
 * Verifiable Presentation schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const VerifiablePresentationSchema = z.object({
  /** JSON-LD context */
  "@context": z.union([VcContextSchema, z.array(VcContextSchema)]),

  /** Presentation identifier */
  id: z.string().optional(),

  /** Presentation type */
  type: presentationTypeSchema(),

  /** Presentation holder */
  holder: DidSchema.optional(),

  /** Verifiable credentials */
  verifiableCredential: z
    .union([VerifiableCredentialSchema, z.array(VerifiableCredentialSchema)])
    .optional(),

  /** Proof (added when presentation is signed) */
  proof: z.union([ProofSchema, z.array(ProofSchema)]).optional()
})
