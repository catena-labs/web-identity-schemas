import type { VerificationMethodType } from "../types"

export const verificationMethodTypes: VerificationMethodType[] = [
  "JsonWebKey2020",
  "Ed25519VerificationKey2020",
  "Ed25519VerificationKey2018",
  "X25519KeyAgreementKey2020",
  "X25519KeyAgreementKey2019",
  "EcdsaSecp256k1VerificationKey2019",
  "EcdsaSecp256r1VerificationKey2019",
  "RsaVerificationKey2018"
]

export const didRegex = /^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]*[a-zA-Z0-9.\-_]$/

export const didUrlRegex =
  /^did:[a-z0-9]+:[a-zA-Z0-9.\-_:%]*[a-zA-Z0-9.\-_]([/?#][^]*)?$/

export const didMethodRegex = /^[a-z0-9]+$/
