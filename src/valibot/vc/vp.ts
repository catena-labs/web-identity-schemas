import * as v from "valibot"
import { DidSchema } from "../did"
import { ProofSchema } from "./core"
import { VerifiableCredentialSchema } from "./vc"
import { VcContextSchema } from "./index"

/**
 * Verifiable Presentation type values.
 * @see {@link https://www.w3.org/TR/vc-data-model/#verifiable-presentations}
 */
export const VpTypeLiteralSchema = v.literal("VerifiablePresentation")

export const vpTypeSchema = (type?: string | string[]) => {
  if (type) {
    return v.tuple([
      VpTypeLiteralSchema,
      ...[type].flat().map((t) => v.literal(t))
    ])
  } else {
    return v.union([
      VpTypeLiteralSchema,
      v.pipe(
        v.array(v.string()),
        v.minLength(1),
        v.check(
          (types) => types[0] === "VerifiablePresentation",
          "First type must be VerifiablePresentation"
        )
      )
    ])
  }
}

/**
 * Relaxed Verifiable Presentation type schema that accepts both string and array formats.
 */
export const VpTypeSchema = vpTypeSchema()

/**
 * Verifiable Presentation schema.
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const VerifiablePresentationSchema = v.object({
  /** JSON-LD context */
  "@context": v.union([VcContextSchema, v.array(VcContextSchema)]),

  /** Presentation identifier */
  id: v.optional(v.string()),

  /** Presentation type */
  type: vpTypeSchema(),

  /** Presentation holder */
  holder: v.optional(DidSchema),

  /** Verifiable credentials */
  verifiableCredential: v.optional(
    v.union([VerifiableCredentialSchema, v.array(VerifiableCredentialSchema)])
  ),

  /** Proof (added when presentation is signed) */
  proof: v.optional(v.union([ProofSchema, v.array(ProofSchema)]))
})
