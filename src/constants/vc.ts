/**
 * Shared Verifiable Credentials context constants.
 * These can be used across different validation libraries (valibot, zod, etc.)
 */

/**
 * Core VC Data Model V1 context.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const vcV1CoreContext = "https://www.w3.org/2018/credentials/v1" as const

/**
 * Core VC Data Model V2 context.
 * @see {@link https://www.w3.org/TR/vc-data-model/#contexts}
 */
export const vcV2CoreContext = "https://www.w3.org/ns/credentials/v2" as const

/**
 * StatusList2021 context (for V1 credentials).
 * @see {@link https://w3c.github.io/vc-status-list-2021/}
 */
export const statusList2021Context =
  "https://w3id.org/vc/status-list/2021/v1" as const

/**
 * BitstringStatusList context (for V2 credentials).
 * @see {@link https://www.w3.org/TR/vc-bitstring-status-list/}
 */
export const bitstringStatusListContext =
  "https://www.w3.org/ns/credentials/status/v1" as const

/**
 * Proof purposes for VCs and VPs.
 * @see {@link https://www.w3.org/TR/vc-data-model/#proofs-signatures}
 */
export const proofPurposes = [
  "assertionMethod",
  "authentication",
  "keyAgreement",
  "capabilityInvocation",
  "capabilityDelegation"
] as const

/**
 * Credential status types.
 * @see {@link https://www.w3.org/TR/vc-data-model/#status}
 */
export const credentialStatusTypes = [
  "RevocationList2020Status",
  "StatusList2021Entry",
  "BitstringStatusListEntry"
] as const

/**
 * Status purposes for credential status.
 */
export const statusPurposes = ["revocation", "suspension"] as const
