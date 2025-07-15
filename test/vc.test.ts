import { test, expect, describe } from "bun:test"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import {
  vcV1CoreContext,
  vcV2CoreContext,
  proofPurposes
} from "../src/constants/vc"

// Helper function to safely test schemas with relaxed typing
function testSchema(input: unknown, schema: unknown): void {
  expect(input).toMatchSchema(schema as never)
}

// Import fixtures
import credentialV1Valid from "./fixtures/vc/credential-v1-valid.json"
import credentialV2Valid from "./fixtures/vc/credential-v2-valid.json"
import invalidMissingContext from "./fixtures/vc/invalid-missing-context.json"
import presentationValid from "./fixtures/vc/presentation-valid.json"

const namespaces = {
  valibot,
  zod
}

describe("vc", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("VcContextSchema", () => {
      test("valid contexts", () => {
        const validContexts = [
          // Single V1 core context
          vcV1CoreContext,
          // Single V2 core context
          vcV2CoreContext,
          // V1 with additional contexts
          [vcV1CoreContext, "https://example.com/custom-context/v1"],
          // V2 with additional contexts
          [vcV2CoreContext, "https://www.w3.org/ns/credentials/status/v1"]
        ]

        for (const context of validContexts) {
          expect(context).toMatchSchema(schemas.VcContextSchema)
        }
      })

      test("invalid contexts", () => {
        const invalidContexts = [
          // Status context without VC core context
          "https://www.w3.org/ns/credentials/status/v1",
          // Custom context without VC core context
          "https://example.com/custom-context/v1",
          // Array without VC core context
          ["https://example.com/custom-context/v1"],
          // Empty array
          []
        ]

        for (const context of invalidContexts) {
          expect(context).not.toMatchSchema(schemas.VcContextSchema)
        }
      })
    })

    describe("VcTypeSchema", () => {
      test("valid credential types", () => {
        testSchema("VerifiableCredential", schemas.VcTypeSchema)
      })

      test("invalid credential types", () => {
        const invalidTypes = ["VerifiablePresentation", "InvalidType", ""]

        for (const type of invalidTypes) {
          expect(type).not.toMatchSchema(schemas.VcTypeSchema as never)
        }
      })
    })

    describe("VpTypeSchema", () => {
      test("valid presentation types", () => {
        expect("VerifiablePresentation").toMatchSchema(schemas.VpTypeSchema)
      })
    })

    describe("ProofPurposeSchema", () => {
      test("valid purposes", () => {
        const validPurposes = [...proofPurposes, "customPurpose"]

        for (const purpose of validPurposes) {
          expect(purpose).toMatchSchema(schemas.ProofPurposeSchema)
        }
      })
    })

    describe("ProofSchema", () => {
      test("valid proof with JWS", () => {
        const validProof = {
          type: "JsonWebSignature2020",
          created: "2023-01-01T00:00:00Z",
          verificationMethod: "did:example:123#key-1",
          proofPurpose: "assertionMethod",
          jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature"
        }

        expect(validProof).toMatchSchema(schemas.ProofSchema, (parsed) => {
          expect(parsed.type).toBe("JsonWebSignature2020")
          expect(parsed.jws as string).toBe(validProof.jws)
        })
      })

      test("valid proof with signatureValue", () => {
        const validProof = {
          type: "Ed25519Signature2020",
          created: "2023-01-01T00:00:00Z",
          verificationMethod: "did:example:123#key-1",
          proofPurpose: "assertionMethod",
          signatureValue: "z3WJ5B+Cqf5+8X3o2A7LRq2j8YcW6uMQ9KP2LhE5vFQq="
        }

        expect(validProof).toMatchSchema(schemas.ProofSchema, (parsed) => {
          expect(parsed.type).toBe("Ed25519Signature2020")
          expect(parsed.signatureValue).toBe(validProof.signatureValue)
        })
      })

      test("proof with challenge and domain", () => {
        const proofWithChallenge = {
          type: "JsonWebSignature2020",
          created: "2023-01-01T00:00:00Z",
          verificationMethod: "did:example:123#key-1",
          proofPurpose: "authentication",
          challenge: "random-challenge-string",
          domain: ["example.com", "app.example.com"],
          jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature"
        }

        expect(proofWithChallenge).toMatchSchema(
          schemas.ProofSchema,
          (parsed) => {
            expect(parsed.challenge).toBe("random-challenge-string")
            expect(Array.isArray(parsed.domain)).toBe(true)
          }
        )
      })
    })

    describe("CredentialStatusSchema", () => {
      test("StatusList2021Entry", () => {
        const validStatus = {
          id: "https://example.com/status/1#94567",
          type: "StatusList2021Entry",
          statusListCredential: "https://example.com/status/1",
          statusListIndex: "94567",
          statusPurpose: "revocation"
        }

        expect(validStatus).toMatchSchema(
          schemas.CredentialStatusSchema,
          (parsed) => {
            expect(parsed.type).toBe("StatusList2021Entry")
            expect(parsed.statusListIndex).toBe("94567")
          }
        )
      })

      test("BitstringStatusListEntry", () => {
        const validStatus = {
          id: "https://example.com/status/2#456",
          type: "BitstringStatusListEntry",
          statusListCredential: "https://example.com/status/2",
          statusListIndex: 456,
          statusPurpose: "suspension"
        }

        expect(validStatus).toMatchSchema(
          schemas.CredentialStatusSchema,
          (parsed) => {
            expect(parsed.type).toBe("BitstringStatusListEntry")
            expect(parsed.statusListIndex).toBe(456)
          }
        )
      })
    })

    describe("VerifiableCredentialSchema", () => {
      test("complete credential", () => {
        const validCredential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
          ],
          id: "http://example.edu/credentials/1872",
          type: ["VerifiableCredential", "UniversityDegreeCredential"],
          issuer: "did:example:565049",
          issuanceDate: "2023-01-01T00:00:00Z",
          expirationDate: "2025-01-01T00:00:00Z",
          credentialSubject: {
            id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
            degree: {
              type: "BachelorDegree",
              name: "Bachelor of Science and Arts"
            }
          },
          proof: {
            type: "JsonWebSignature2020",
            created: "2023-01-01T00:00:00Z",
            verificationMethod: "did:example:123#key-1",
            proofPurpose: "assertionMethod",
            jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature"
          }
        }

        expect(validCredential).toMatchSchema(
          schemas.VerifiableCredentialSchema,
          (parsed) => {
            expect(parsed.type).toContain("VerifiableCredential")
            expect((parsed.credentialSubject as { id?: string }).id).toBe(
              "did:example:ebfeb1f712ebc6f1c276e12ec21"
            )
            expect(
              Array.isArray(parsed.proof)
                ? parsed.proof[0]?.type
                : parsed.proof?.type
            ).toBe("JsonWebSignature2020")
          }
        )
      })

      test("minimal credential", () => {
        const minimalCredential = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiableCredential",
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          credentialSubject: {}
        }

        expect(minimalCredential).toMatchSchema(
          schemas.VerifiableCredentialSchema,
          (parsed) => {
            expect(parsed.type).toEqual(["VerifiableCredential"])
            expect(parsed.issuer).toBe("did:example:123")
          }
        )
      })

      test("discriminated union accepts both V1 and V2", () => {
        // V1 credential should be valid
        expect(credentialV1Valid).toMatchSchema(
          schemas.VerifiableCredentialSchema
        )

        // V2 credential should be valid
        expect(credentialV2Valid).toMatchSchema(
          schemas.VerifiableCredentialSchema
        )
      })

      test("invalid credentials", () => {
        const invalidCredentials = [
          {}, // Missing required fields
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiableCredential"
            // Missing issuer, issuanceDate, credentialSubject
          },
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiableCredential",
            issuer: "did:example:123",
            issuanceDate: "2023-01-01T00:00:00Z",
            credentialSubject: {},
            proof: {
              type: "JsonWebSignature2020",
              created: "2023-01-01T00:00:00Z",
              verificationMethod: "did:example:123#key-1",
              proofPurpose: "assertionMethod",
              jws: "invalid-jws" // Invalid JWS format (should be header.payload.signature)
            }
          }
        ]

        for (const credential of invalidCredentials) {
          expect(credential).not.toMatchSchema(
            schemas.VerifiableCredentialSchema
          )
        }
      })
    })

    describe("VerifiableCredentialV1Schema", () => {
      test("V1 specific fields", () => {
        const v1Credential = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiableCredential",
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          expirationDate: "2025-01-01T00:00:00Z",
          credentialSubject: { id: "did:example:456", name: "Alice" }
        }

        expect(v1Credential).toMatchSchema(
          schemas.VerifiableCredentialV1Schema,
          (parsed) => {
            expect(parsed).toHaveProperty("issuanceDate")
            expect(parsed).toHaveProperty("expirationDate")
            expect(parsed).not.toHaveProperty("validFrom")
            expect(parsed).not.toHaveProperty("validUntil")
          }
        )

        // V1 credentials should NOT have V2 fields
        const v1WithV2Fields = {
          ...v1Credential,
          validFrom: "2023-01-01T00:00:00Z",
          validUntil: "2025-01-01T00:00:00Z"
        }

        expect(v1WithV2Fields).not.toMatchSchema(
          schemas.VerifiableCredentialV1Schema
        )
      })
    })

    describe("VerifiableCredentialV2Schema", () => {
      test("V2 specific fields", () => {
        const v2Credential = {
          "@context": "https://www.w3.org/ns/credentials/v2",
          type: "VerifiableCredential",
          issuer: "did:example:123",
          validFrom: "2023-01-01T00:00:00Z",
          validUntil: "2025-01-01T00:00:00Z",
          credentialSubject: { id: "did:example:456", name: "Alice" }
        }

        expect(v2Credential).toMatchSchema(
          schemas.VerifiableCredentialV2Schema,
          (parsed) => {
            expect(parsed).toHaveProperty("validFrom")
            expect(parsed).toHaveProperty("validUntil")
            expect(parsed).not.toHaveProperty("issuanceDate")
            expect(parsed).not.toHaveProperty("expirationDate")
          }
        )

        // V2 credentials should NOT have V1 fields
        const v2WithV1Fields = {
          ...v2Credential,
          issuanceDate: "2023-01-01T00:00:00Z",
          expirationDate: "2025-01-01T00:00:00Z"
        }

        expect(v2WithV1Fields).not.toMatchSchema(
          schemas.VerifiableCredentialV2Schema
        )
      })
    })

    describe("VerifiablePresentationSchema", () => {
      test("valid presentation", () => {
        const validPresentation = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1"
          ],
          id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
          type: ["VerifiablePresentation", "CredentialManagerPresentation"],
          verifiableCredential: [
            {
              "@context": "https://www.w3.org/2018/credentials/v1",
              type: "VerifiableCredential",
              issuer: "did:example:123",
              issuanceDate: "2023-01-01T00:00:00Z",
              credentialSubject: { id: "did:example:456" }
            }
          ],
          proof: {
            type: "JsonWebSignature2020",
            created: "2023-01-01T00:00:00Z",
            verificationMethod: "did:example:123#key-1",
            proofPurpose: "authentication",
            challenge: "challenge-123",
            jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature"
          }
        }

        expect(validPresentation).toMatchSchema(
          schemas.VerifiablePresentationSchema,
          (parsed) => {
            expect(parsed.type).toContain("VerifiablePresentation")
            expect(Array.isArray(parsed.verifiableCredential)).toBe(true)
            expect(
              Array.isArray(parsed.proof)
                ? parsed.proof[0]?.challenge
                : parsed.proof?.challenge
            ).toBe("challenge-123")
          }
        )
      })

      test("minimal presentation", () => {
        const minimalPresentation = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiablePresentation"
        }

        expect(minimalPresentation).toMatchSchema(
          schemas.VerifiablePresentationSchema,
          (parsed) => {
            expect(parsed.type).toBe("VerifiablePresentation")
          }
        )
      })

      test("invalid presentations", () => {
        const invalidPresentations = [
          {}, // Missing required fields
          {
            "@context": "https://www.w3.org/2018/credentials/v1"
            // Missing type
          },
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiablePresentation",
            verifiableCredential: "not-an-array-or-object" // Wrong type
          }
        ]

        for (const presentation of invalidPresentations) {
          expect(presentation).not.toMatchSchema(
            schemas.VerifiablePresentationSchema
          )
        }
      })
    })

    describe("StatusList2021CredentialSubjectSchema", () => {
      test("valid status list", () => {
        const validStatusList = {
          id: "did:example:status:1",
          type: "StatusList2021",
          statusPurpose: "revocation",
          encodedList:
            "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA"
        }

        expect(validStatusList).toMatchSchema(
          schemas.StatusList2021CredentialSubjectSchema,
          (parsed) => {
            expect(parsed.type).toBe("StatusList2021")
            expect(parsed.statusPurpose).toBe("revocation")
          }
        )
      })
    })

    describe("StatusList2021CredentialSchema", () => {
      test("complete status list credential", () => {
        const statusListCredential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1"
          ],
          id: "did:example:status:1",
          type: ["VerifiableCredential", "StatusList2021Credential"],
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          credentialSubject: {
            id: "did:example:status:1",
            type: "StatusList2021",
            statusPurpose: "revocation",
            encodedList:
              "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA"
          }
        }

        expect(statusListCredential).toMatchSchema(
          schemas.StatusList2021CredentialSchema,
          (parsed: { credentialSubject: { type: string } }) => {
            expect(parsed.credentialSubject.type).toBe("StatusList2021")
          }
        )
      })
    })

    test("BitstringStatusListCredentialSubjectSchema - valid with TTL", () => {
      const validBitstringStatusList = {
        id: "did:example:status:2",
        type: "BitstringStatusList",
        statusPurpose: "suspension",
        encodedList:
          "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
        ttl: 86400
      }

      expect(validBitstringStatusList).toMatchSchema(
        schemas.BitstringStatusListCredentialSubjectSchema,
        (parsed) => {
          expect(parsed.type).toBe("BitstringStatusList")
          expect(parsed.ttl).toBe(86400)
        }
      )
    })

    test("BitstringStatusListCredentialSchema - complete bitstring credential", () => {
      const bitstringCredential = {
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://www.w3.org/ns/credentials/status/v1"
        ],
        id: "did:example:status:2",
        type: ["VerifiableCredential", "BitstringStatusListCredential"],
        issuer: "did:example:123",
        validFrom: "2023-01-01T00:00:00Z",
        credentialSubject: {
          id: "did:example:status:2",
          type: "BitstringStatusList",
          statusPurpose: "suspension",
          encodedList:
            "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
          ttl: 86400
        }
      }

      expect(bitstringCredential).toMatchSchema(
        schemas.BitstringStatusListCredentialSchema,
        (parsed: { credentialSubject: { type: string } }) => {
          expect(parsed.credentialSubject.type).toBe("BitstringStatusList")
        }
      )
    })

    test("fixture-based validation tests", () => {
      // Test valid V1 credential from fixture
      expect(credentialV1Valid).toMatchSchema(
        schemas.VerifiableCredentialV1Schema
      )
      expect(credentialV1Valid).toMatchSchema(
        schemas.VerifiableCredentialSchema
      )

      // Test valid V2 credential from fixture
      expect(credentialV2Valid).toMatchSchema(
        schemas.VerifiableCredentialV2Schema
      )
      expect(credentialV2Valid).toMatchSchema(
        schemas.VerifiableCredentialSchema
      )

      // Test valid presentation from fixture
      expect(presentationValid).toMatchSchema(
        schemas.VerifiablePresentationSchema
      )

      // Test invalid credential missing context
      expect(invalidMissingContext).not.toMatchSchema(
        schemas.VerifiableCredentialSchema
      )
    })

    test("URI support - HTTP URL issuer and subject", () => {
      // Test credential with HTTP URL issuer and subject ID
      const credentialWithHttpUrls = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        type: "VerifiableCredential",
        issuer: "https://example.edu/issuers/565049",
        issuanceDate: "2023-01-01T00:00:00Z",
        credentialSubject: {
          id: "https://example.com/users/alice",
          name: "Alice Smith"
        }
      }

      expect(credentialWithHttpUrls).toMatchSchema(
        schemas.VerifiableCredentialSchema
      )

      // Test credential with issuer object containing HTTP URL
      const credentialWithIssuerObject = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        type: "VerifiableCredential",
        issuer: {
          id: "https://example.edu/issuers/565049",
          name: "Example University"
        },
        issuanceDate: "2023-01-01T00:00:00Z",
        credentialSubject: {}
      }

      expect(credentialWithIssuerObject).toMatchSchema(
        schemas.VerifiableCredentialSchema
      )
    })
  })
})
