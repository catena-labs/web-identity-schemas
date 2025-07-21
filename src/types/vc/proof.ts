import type { JwsString } from "../jose/jws"
import type { DateTimeStamp } from "../shared/json-ld"
import type { Uri } from "../shared/uri"

/**
 * Proof purpose values.
 * @see {@link https://w3c.github.io/vc-data-integrity/#proof-purposes}
 */
export type ProofPurpose =
  | "assertionMethod"
  | "authentication"
  | "keyAgreement"
  | "capabilityInvocation"
  | "capabilityDelegation"
  | string // Allow custom proof purposes

/**
 * Data integrity proof
 * @see {@link https://w3c.github.io/vc-data-integrity/#proofs}
 */
export interface Proof {
  /** Proof type */
  type: string

  /** Creation timestamp */
  created?: DateTimeStamp

  /** Verification method */
  verificationMethod: Uri

  /** Proof purpose */
  proofPurpose: ProofPurpose

  /** Challenge (for presentations) */
  challenge?: string

  /** Domain (for presentations) */
  domain?: string | string[]

  /** Nonce */
  nonce?: string

  /** JWS signature (for JsonWebSignature2020) */
  jws?: JwsString

  /** Signature value (for other proof types) */
  signatureValue?: string

  /** Proof value (generic) */
  proofValue?: string
}
