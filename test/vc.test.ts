import { test, expect, describe } from "vitest"

import {
  vcV1CoreContext,
  vcV2CoreContext,
  proofPurposes,
} from "../src/constants/vc"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import credentialV1Valid from "./fixtures/vc/credential-v1-valid.json"
import credentialV2Valid from "./fixtures/vc/credential-v2-valid.json"
import invalidMissingContext from "./fixtures/vc/invalid-missing-context.json"
import presentationValid from "./fixtures/vc/presentation-valid.json"

// Helper function to safely test schemas with relaxed typing
function testSchema(input: unknown, schema: unknown): void {
  expect(input).toMatchSchema(schema as never)
}

const namespaces = {
  valibot,
  zod,
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
          [vcV2CoreContext, "https://www.w3.org/ns/credentials/status/v1"],
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
          [],
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
          jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
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
          signatureValue: "z3WJ5B+Cqf5+8X3o2A7LRq2j8YcW6uMQ9KP2LhE5vFQq=",
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
          jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
        }

        expect(proofWithChallenge).toMatchSchema(
          schemas.ProofSchema,
          (parsed) => {
            expect(parsed.challenge).toBe("random-challenge-string")
            expect(Array.isArray(parsed.domain)).toBe(true)
          },
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
          statusPurpose: "revocation",
        }

        expect(validStatus).toMatchSchema(
          schemas.CredentialStatusSchema,
          (parsed) => {
            expect(parsed.type).toBe("StatusList2021Entry")
            expect(parsed.statusListIndex).toBe("94567")
          },
        )
      })

      test("BitstringStatusListEntry", () => {
        const validStatus = {
          id: "https://example.com/status/2#456",
          type: "BitstringStatusListEntry",
          statusListCredential: "https://example.com/status/2",
          statusListIndex: 456,
          statusPurpose: "suspension",
        }

        expect(validStatus).toMatchSchema(
          schemas.CredentialStatusSchema,
          (parsed) => {
            expect(parsed.type).toBe("BitstringStatusListEntry")
            expect(parsed.statusListIndex).toBe(456)
          },
        )
      })
    })

    describe("VerifiableCredentialSchema", () => {
      test("complete credential", () => {
        const validCredential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
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
              name: "Bachelor of Science and Arts",
            },
          },
          proof: {
            type: "JsonWebSignature2020",
            created: "2023-01-01T00:00:00Z",
            verificationMethod: "did:example:123#key-1",
            proofPurpose: "assertionMethod",
            jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
          },
        }

        expect(validCredential).toMatchSchema(
          schemas.VerifiableCredentialSchema,
          (parsed) => {
            expect(parsed.type).toContain("VerifiableCredential")
            expect((parsed.credentialSubject as { id?: string }).id).toBe(
              "did:example:ebfeb1f712ebc6f1c276e12ec21",
            )
            expect(
              Array.isArray(parsed.proof)
                ? parsed.proof[0]!.type
                : parsed.proof.type,
            ).toBe("JsonWebSignature2020")
          },
        )
      })

      test("minimal credential", () => {
        const minimalCredential = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiableCredential",
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          credentialSubject: {},
        }

        expect(minimalCredential).toMatchSchema(
          schemas.W3CCredentialSchema,
          (parsed) => {
            expect(parsed.type).toEqual(["VerifiableCredential"])
            expect(parsed.issuer).toBe("did:example:123")
          },
        )
      })

      test("discriminated union accepts both V1 and V2", () => {
        // V1 credential should be valid
        expect(credentialV1Valid).toMatchSchema(schemas.W3CCredentialSchema)

        // V2 credential should be valid
        expect(credentialV2Valid).toMatchSchema(schemas.W3CCredentialSchema)
      })

      test("invalid credentials", () => {
        const invalidCredentials = [
          {}, // Missing required fields
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiableCredential",
            // Missing issuer, issuanceDate, credentialSubject
          },
        ]

        for (const credential of invalidCredentials) {
          expect(credential).not.toMatchSchema(schemas.W3CCredentialSchema)
        }
      })

      test("invalid verifiable credentials", () => {
        const invalidCredentials = [
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
              jws: "invalid-jws", // Invalid JWS format (should be header.payload.signature)
            },
          },
        ]

        for (const credential of invalidCredentials) {
          expect(credential).not.toMatchSchema(
            schemas.VerifiableCredentialSchema,
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
          credentialSubject: { id: "did:example:456", name: "Alice" },
        }

        expect(v1Credential).toMatchSchema(
          schemas.CredentialV1Schema,
          (parsed) => {
            expect(parsed).toHaveProperty("issuanceDate")
            expect(parsed).toHaveProperty("expirationDate")
            expect(parsed).not.toHaveProperty("validFrom")
            expect(parsed).not.toHaveProperty("validUntil")
          },
        )

        // V1 credentials should NOT have V2 fields
        const v1WithV2Fields = {
          ...v1Credential,
          validFrom: "2023-01-01T00:00:00Z",
          validUntil: "2025-01-01T00:00:00Z",
        }

        expect(v1WithV2Fields).not.toMatchSchema(
          schemas.VerifiableCredentialV1Schema,
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
          credentialSubject: { id: "did:example:456", name: "Alice" },
        }

        expect(v2Credential).toMatchSchema(
          schemas.CredentialV2Schema,
          (parsed) => {
            expect(parsed).toHaveProperty("validFrom")
            expect(parsed).toHaveProperty("validUntil")
            expect(parsed).not.toHaveProperty("issuanceDate")
            expect(parsed).not.toHaveProperty("expirationDate")
          },
        )

        // V2 credentials should NOT have V1 fields
        const v2WithV1Fields = {
          ...v2Credential,
          issuanceDate: "2023-01-01T00:00:00Z",
          expirationDate: "2025-01-01T00:00:00Z",
        }

        expect(v2WithV1Fields).not.toMatchSchema(
          schemas.VerifiableCredentialV2Schema,
        )
      })
    })

    describe("VerifiablePresentationSchema", () => {
      test("valid presentation", () => {
        const validPresentation = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://www.w3.org/2018/credentials/examples/v1",
          ],
          id: "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
          type: ["VerifiablePresentation", "CredentialManagerPresentation"],
          verifiableCredential: [
            {
              "@context": "https://www.w3.org/2018/credentials/v1",
              type: "VerifiableCredential",
              issuer: "did:example:123",
              issuanceDate: "2023-01-01T00:00:00Z",
              credentialSubject: { id: "did:example:456" },
            },
          ],
          proof: {
            type: "JsonWebSignature2020",
            created: "2023-01-01T00:00:00Z",
            verificationMethod: "did:example:123#key-1",
            proofPurpose: "authentication",
            challenge: "challenge-123",
            jws: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
          },
        }

        expect(validPresentation).toMatchSchema(
          schemas.VerifiablePresentationSchema,
          (parsed) => {
            expect(parsed.type).toContain("VerifiablePresentation")
            expect(Array.isArray(parsed.verifiableCredential)).toBe(true)
            expect(
              Array.isArray(parsed.proof)
                ? parsed.proof[0]!.challenge
                : parsed.proof.challenge,
            ).toBe("challenge-123")
          },
        )
      })

      test("minimal presentation", () => {
        const minimalPresentation = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiablePresentation",
        }

        expect(minimalPresentation).toMatchSchema(
          schemas.PresentationSchema,
          (parsed) => {
            expect(parsed.type).toBe("VerifiablePresentation")
          },
        )
      })

      test("invalid presentations", () => {
        const invalidPresentations = [
          {}, // Missing required fields
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            // Missing type
          },
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiablePresentation",
            verifiableCredential: "not-an-array-or-object", // Wrong type
          },
        ]

        for (const presentation of invalidPresentations) {
          expect(presentation).not.toMatchSchema(
            schemas.VerifiablePresentationSchema,
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
            "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
        }

        expect(validStatusList).toMatchSchema(
          schemas.StatusList2021CredentialSubjectSchema,
          (parsed) => {
            expect(parsed.type).toBe("StatusList2021")
            expect(parsed.statusPurpose).toBe("revocation")
          },
        )
      })
    })

    describe("StatusList2021CredentialSchema", () => {
      test("complete status list credential", () => {
        const statusListCredential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1",
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
              "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
          },
        }

        expect(statusListCredential).toMatchSchema(
          schemas.StatusList2021CredentialSchema,
          (parsed: {
            credentialSubject: { type: string } | { type: string }[]
          }) => {
            const subject = Array.isArray(parsed.credentialSubject)
              ? parsed.credentialSubject[0]!
              : parsed.credentialSubject
            expect(subject.type).toBe("StatusList2021")
          },
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
        ttl: 86400,
      }

      expect(validBitstringStatusList).toMatchSchema(
        schemas.BitstringStatusListCredentialSubjectSchema,
        (parsed) => {
          expect(parsed.type).toBe("BitstringStatusList")
          expect(parsed.ttl).toBe(86400)
        },
      )
    })

    test("BitstringStatusListCredentialSchema - complete bitstring credential", () => {
      const bitstringCredential = {
        "@context": [
          "https://www.w3.org/ns/credentials/v2",
          "https://www.w3.org/ns/credentials/status/v1",
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
          ttl: 86400,
        },
      }

      expect(bitstringCredential).toMatchSchema(
        schemas.BitstringStatusListCredentialSchema,
        (parsed: {
          credentialSubject: { type: string } | { type: string }[]
        }) => {
          const subject = Array.isArray(parsed.credentialSubject)
            ? parsed.credentialSubject[0]!
            : parsed.credentialSubject
          expect(subject.type).toBe("BitstringStatusList")
        },
      )
    })

    test("fixture-based validation tests", () => {
      // Test valid V1 credential from fixture
      expect(credentialV1Valid).toMatchSchema(schemas.CredentialV1Schema)
      expect(credentialV1Valid).toMatchSchema(schemas.W3CCredentialSchema)

      // Test valid V2 credential from fixture
      expect(credentialV2Valid).toMatchSchema(schemas.CredentialV2Schema)
      expect(credentialV2Valid).toMatchSchema(schemas.W3CCredentialSchema)

      // Test valid presentation from fixture
      expect(presentationValid).toMatchSchema(schemas.PresentationSchema)

      // Test invalid credential missing context
      expect(invalidMissingContext).not.toMatchSchema(
        schemas.W3CCredentialSchema,
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
          name: "Alice Smith",
        },
      }

      expect(credentialWithHttpUrls).toMatchSchema(schemas.W3CCredentialSchema)

      // Test credential with issuer object containing HTTP URL
      const credentialWithIssuerObject = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        type: "VerifiableCredential",
        issuer: {
          id: "https://example.edu/issuers/565049",
          name: "Example University",
        },
        issuanceDate: "2023-01-01T00:00:00Z",
        credentialSubject: {},
      }

      expect(credentialWithIssuerObject).toMatchSchema(
        schemas.W3CCredentialSchema,
      )
    })

    describe("spec conformance and parity", () => {
      const baseV1 = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        type: "VerifiableCredential",
        issuer: "did:example:issuer",
        issuanceDate: "2023-01-01T00:00:00Z",
        credentialSubject: { id: "did:example:subject" },
      }
      const baseV2 = {
        "@context": "https://www.w3.org/ns/credentials/v2",
        type: "VerifiableCredential",
        issuer: "did:example:issuer",
        credentialSubject: { id: "did:example:subject" },
      }

      test("accepts datetimes with numeric timezone offsets", () => {
        testSchema(
          { ...baseV1, issuanceDate: "2023-01-01T00:00:00+02:00" },
          schemas.CredentialV1Schema,
        )
      })

      test("accepts datetimes with sub-second precision", () => {
        testSchema(
          { ...baseV1, issuanceDate: "2023-01-01T00:00:00.123456Z" },
          schemas.CredentialV1Schema,
        )
      })

      test("rejects @context where the core context is not first", () => {
        expect({
          ...baseV1,
          "@context": [
            "https://example.com/custom/v1",
            "https://www.w3.org/2018/credentials/v1",
          ],
        }).not.toMatchSchema(schemas.CredentialV1Schema as never)
      })

      test("V2 credential allows unknown top-level fields (loose)", () => {
        testSchema(
          { ...baseV2, somethingExtra: true },
          schemas.CredentialV2Schema,
        )
      })

      test("presentation holder accepts an object with id", () => {
        testSchema(
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiablePresentation",
            holder: { id: "did:example:holder" },
          },
          schemas.PresentationSchema,
        )
      })

      test("presentation accepts an enveloped JWT-string credential", () => {
        testSchema(
          {
            "@context": "https://www.w3.org/2018/credentials/v1",
            type: "VerifiablePresentation",
            verifiableCredential: [
              "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
            ],
          },
          schemas.PresentationSchema,
        )
      })

      test("presentation rejects a bare (non-array) verifiableCredential", () => {
        const presentation = {
          "@context": "https://www.w3.org/2018/credentials/v1",
          type: "VerifiablePresentation",
          verifiableCredential:
            "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature",
        }
        expect(presentation).not.toMatchSchema(schemas.PresentationSchema)
      })

      test("vpTypeSchema with types requires VerifiablePresentation first (parity)", () => {
        const typedSchema = schemas.vpTypeSchema("CustomType")
        // Must include VerifiablePresentation as first element
        expect(["VerifiablePresentation", "CustomType"]).toMatchSchema(
          typedSchema as never,
        )
        // Missing VerifiablePresentation should be rejected
        expect(["CustomType"]).not.toMatchSchema(typedSchema as never)
        // Bare string should be rejected when types are specified
        expect("CustomType").not.toMatchSchema(typedSchema as never)
      })

      test("vpTypeSchema with array of types requires VerifiablePresentation first (parity)", () => {
        const typedSchema = schemas.vpTypeSchema(["CustomType1", "CustomType2"])
        expect([
          "VerifiablePresentation",
          "CustomType1",
          "CustomType2",
        ]).toMatchSchema(typedSchema as never)
        expect(["CustomType1", "CustomType2"]).not.toMatchSchema(
          typedSchema as never,
        )
      })

      test("V2 credential requires core context first (V2 spec requirement)", () => {
        // V2 spec says first context must be the V2 core context
        expect({
          ...baseV2,
          "@context": [
            "https://example.com/custom/v1",
            "https://www.w3.org/ns/credentials/v2",
          ],
        }).not.toMatchSchema(schemas.CredentialV2Schema as never)
      })

      test("V2 credential still requires V2 core context to be present", () => {
        expect({
          ...baseV2,
          "@context": ["https://example.com/custom/v1"],
        }).not.toMatchSchema(schemas.CredentialV2Schema)
      })

      test("V1 credential requires core context first (V1 spec requirement)", () => {
        // V1 spec says first context must be the V1 core context
        expect({
          ...baseV1,
          "@context": [
            "https://example.com/custom/v1",
            "https://www.w3.org/2018/credentials/v1",
          ],
        }).not.toMatchSchema(schemas.CredentialV1Schema as never)
      })

      test("issuer object preserves extra keys (IdOrObject passthrough)", () => {
        const credential = {
          ...baseV1,
          issuer: {
            id: "did:example:issuer",
            name: "Example University",
            description: "A university",
          },
        }
        expect(credential).toMatchSchema(
          schemas.CredentialV1Schema,
          (parsed: {
            issuer:
              | string
              | { id?: string; name?: string; description?: string }
          }) => {
            const issuer =
              typeof parsed.issuer === "object" ? parsed.issuer : {}
            expect(issuer.name).toBe("Example University")
            expect(issuer.description).toBe("A university")
          },
        )
      })

      test("status list subject id accepts URL (not restricted to DIDs)", () => {
        const statusListCredential = {
          "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/status/v1",
          ],
          id: "https://example.com/status/1",
          type: ["VerifiableCredential", "BitstringStatusListCredential"],
          issuer: "did:example:123",
          validFrom: "2023-01-01T00:00:00Z",
          credentialSubject: {
            id: "https://example.com/status/1",
            type: "BitstringStatusList",
            statusPurpose: "revocation",
            encodedList:
              "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
          },
        }

        expect(statusListCredential).toMatchSchema(
          schemas.BitstringStatusListCredentialSchema,
        )
      })

      test("status list credential rejects missing specific type (parity)", () => {
        const bitstringWithoutType = {
          "@context": [
            "https://www.w3.org/ns/credentials/v2",
            "https://www.w3.org/ns/credentials/status/v1",
          ],
          id: "did:example:status:2",
          type: ["VerifiableCredential"], // Missing BitstringStatusListCredential
          issuer: "did:example:123",
          validFrom: "2023-01-01T00:00:00Z",
          credentialSubject: {
            id: "did:example:status:2",
            type: "BitstringStatusList",
            statusPurpose: "suspension",
            encodedList:
              "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
          },
        }

        expect(bitstringWithoutType).not.toMatchSchema(
          schemas.BitstringStatusListCredentialSchema,
        )

        const statusListWithoutType = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1",
          ],
          id: "did:example:status:1",
          type: ["VerifiableCredential"], // Missing StatusList2021Credential
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          credentialSubject: {
            id: "did:example:status:1",
            type: "StatusList2021",
            statusPurpose: "revocation",
            encodedList:
              "H4sIAAAAAAAAAKtWyk1VslIyNjPQM7Q01ivOVLI30os3AAAczJJKNQAAAA",
          },
        }

        expect(statusListWithoutType).not.toMatchSchema(
          schemas.StatusList2021CredentialSchema,
        )
      })

      test("status list context requires V2 core context first (parity)", () => {
        const bitstringReversedContext = {
          "@context": [
            "https://www.w3.org/ns/credentials/status/v1",
            "https://www.w3.org/ns/credentials/v2",
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
          },
        }

        expect(bitstringReversedContext).not.toMatchSchema(
          schemas.BitstringStatusListCredentialSchema,
        )
      })

      test("BaseCredentialSchema requires @context", () => {
        const noContext = {
          id: "http://example.edu/credentials/1872",
          type: ["VerifiableCredential"],
          issuer: "did:example:565049",
          credentialSubject: { id: "did:example:subject" },
        }
        expect(noContext).not.toMatchSchema(schemas.BaseCredentialSchema)
      })

      test("createCredentialSchema accepts contextSchema parameter (parity)", () => {
        const customSchema = schemas.createCredentialSchema(
          schemas.CredentialSubjectSchema as never,
          undefined,
          "https://example.com/custom-context/v1",
        )
        const credential = {
          "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://example.com/custom-context/v1",
          ],
          type: "VerifiableCredential",
          issuer: "did:example:123",
          issuanceDate: "2023-01-01T00:00:00Z",
          credentialSubject: { id: "did:example:subject" },
        }
        expect(credential).toMatchSchema(customSchema as never)
      })

      test("DateTimeStampSchema is exported", () => {
        expect(schemas.DateTimeStampSchema).toBeDefined()
        expect("2023-01-01T00:00:00Z").toMatchSchema(
          schemas.DateTimeStampSchema,
        )
        expect("not-a-date").not.toMatchSchema(schemas.DateTimeStampSchema)
      })

      test("jsonLdContextSchema is exported", () => {
        expect(schemas.jsonLdContextSchema).toBeDefined()
        const ctxSchema = schemas.jsonLdContextSchema(
          "https://www.w3.org/ns/credentials/v2",
        )
        expect("https://www.w3.org/ns/credentials/v2").toMatchSchema(
          ctxSchema as never,
        )
        expect(["https://www.w3.org/ns/credentials/v2"]).toMatchSchema(
          ctxSchema as never,
        )
      })

      test("JwtHeaderUnsecuredSchema is exported", () => {
        expect(schemas.JwtHeaderUnsecuredSchema).toBeDefined()
      })

      test("jsonLdContextSchema preserves detailed error messages", async () => {
        const ctxSchema = schemas.jsonLdContextSchema([
          "https://www.w3.org/ns/credentials/v2",
          "https://www.w3.org/ns/credentials/status/v1",
        ])
        const badContext = ["https://example.com/custom"]

        const standard = (
          ctxSchema as never as {
            "~standard": {
              validate: (
                v: unknown,
              ) => Promise<
                { issues?: { message: string }[] } | { value: unknown }
              >
            }
          }
        )["~standard"]
        const result = await standard.validate(badContext)
        const issues = "issues" in result ? result.issues : undefined

        expect(issues).toBeDefined()
        expect(issues![0]!.message).toContain("required contexts")
      })
    })
  })
})
