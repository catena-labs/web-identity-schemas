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
