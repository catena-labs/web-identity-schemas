import * as v from "valibot"
import { DidSchema } from "../did"
import { ProofSchema } from "./core"
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
  holder: v.optional(DidSchema),

  /** Verifiable credentials */
  verifiableCredential: v.optional(
    v.union([W3CCredentialSchema, v.array(W3CCredentialSchema)])
  )
})

/**
 * Verifiable Presentation schema (with required proof).
 * @see {@link https://www.w3.org/TR/vc-data-model/#presentations}
 */
export const VerifiablePresentationSchema = v.object({
  ...PresentationSchema.entries,
  /** Proof (required for verifiable presentations) */
  proof: v.union([ProofSchema, v.array(ProofSchema)])
})
