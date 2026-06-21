import type {
  LegacyVerificationMethodType,
  VerificationMethodType,
} from "../types"

export const legacyVerificationMethodTypes: LegacyVerificationMethodType[] = [
  "JsonWebKey2020",
  "Ed25519VerificationKey2020",
  "Ed25519VerificationKey2018",
  "X25519KeyAgreementKey2020",
  "X25519KeyAgreementKey2019",
  "EcdsaSecp256k1VerificationKey2019",
  "EcdsaSecp256r1VerificationKey2019",
  "RsaVerificationKey2018",
]

export const verificationMethodTypes: VerificationMethodType[] = [
  "JsonWebKey",
  "Multikey",
]

export const didRegex =
  /^did:[a-z0-9]+:(?:[a-zA-Z0-9._-]|%[0-9A-Fa-f]{2}|:)*(?:[a-zA-Z0-9._-]|%[0-9A-Fa-f]{2})$/

export const didUrlRegex =
  /^did:[a-z0-9]+:(?:[a-zA-Z0-9._-]|%[0-9A-Fa-f]{2}|:)*(?:[a-zA-Z0-9._-]|%[0-9A-Fa-f]{2})([/?#](?:[a-zA-Z0-9._~!$&'()*+,;=:@/?#-]|%[0-9A-Fa-f]{2})*)?$/

export const didMethodRegex = /^[a-z0-9]+$/

export const base58btcMultibaseRegex = /^z[1-9A-HJ-NP-Za-km-z]+$/
