import { test, expect, describe } from "vitest"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"
import didKeyValid from "./fixtures/did/did-key-valid.json"
import didWebValid from "./fixtures/did/did-web-valid.json"
import documentValid from "./fixtures/did/document-valid.json"
import invalidBadFormat from "./fixtures/did/invalid-bad-format.json"

const namespaces = {
  valibot,
  zod
}

describe("did", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("DidSchema", () => {
      test("valid DIDs", () => {
        const validDids = [
          "did:example:123456789abcdefghi",
          "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
          "did:web:example.com",
          "did:web:example.com:user:alice",
          "did:ethr:0x1234567890abcdef1234567890abcdef12345678",
          "did:ion:EiClkZMDxPKqC9c-umQfTkR8vvZ9JPhl_xLDI9Nfk38w5w",
          "did:jwk:eyJhbGciOiJFUzI1NiIsInVzZSI6InNpZyIsImtleV9vcHMiOlsidmVyaWZ5Il0sImNydiI6InNlY3AyNTZrMSIsImtpZCI6IlVubDY5aXZNcERzT0YtN21wZHJPQ0drSTU1QTdBMVVrcEFaRzl3aDRHVUEiLCJrdHkiOiJFQyIsIngiOiJKU0Y5X29zeFN3dGdGLWhKZmZGdEl4Y2VEZGRURUQ4SmE1RG02eGxGcUZjIiwieSI6InBfWlJyVzRULW9zWHJQNktMOE1hUTlKZ3NLWVBoc3lVUXlycWJ5UWlETVEifQ",
          "did:pkh:eip155:1:0x1234567890abcdef1234567890abcdef12345678",
          "did:method:specific-identifier_with-dashes.and_underscores"
        ] as const

        for (const did of validDids) {
          expect(did).toMatchSchema(schemas.DidSchema)
          expect(schemas.isDid(did)).toBe(true)
        }
      })

      test("invalid DIDs", () => {
        const invalidDids = [
          "not-a-did",
          "did:", // Missing method and identifier
          "did:method", // Missing identifier
          "did:method:", // Empty identifier
          "did::identifier", // Empty method
          ":method:identifier", // Missing 'did' prefix
          "DID:method:identifier", // Wrong case
          "did:method:identifier:", // Trailing colon
          "did:method with space:identifier", // Space in method
          "did:method:identifier\\n", // Newline
          "did:method:identifier with space", // Space in identifier
          "",
          "did:method:identifier#" // Fragment should be in DidUrlSchema
        ]

        for (const did of invalidDids) {
          expect(did).not.toMatchSchema(schemas.DidSchema)
        }
      })
    })

    describe("createDidSchema", () => {
      test("creates a schema that matches the method", () => {
        const schema = schemas.createDidSchema("example")

        expect("did:example:123456789abcdefghi").toMatchSchema(schema)
        expect("did:bad:123456789abcdefghi").not.toMatchSchema(schema)
        expect(
          schemas.isDidWithMethod("example", "did:example:123456789abcdefghi")
        ).toBe(true)
        expect(
          schemas.isDidWithMethod("example", "did:bad:123456789abcdefghi")
        ).toBe(false)
      })
    })

    describe("DidUrlSchema", () => {
      test("valid DID URLs", () => {
        const validDidUrls = [
          // Basic DIDs (should also work)
          "did:example:123456789abcdefghi",
          "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",

          // DID URLs with fragments
          "did:example:123456789abcdefghi#keys-1",
          "did:example:123456789abcdefghi#service-1",
          "did:web:example.com#key-1",

          // DIDs with ports
          "did:web:example.com%3A8080",
          "did:web:localhost%3A8080",
          "did:web:localhost%3A8080:user:alice",

          // DID URLs with paths
          "did:web:example.com/user/alice",
          "did:web:example.com/users/alice",

          // DID URLs with queries
          "did:example:123456789abcdefghi?version=1",
          "did:example:123456789abcdefghi?service=files&version=1",

          // DID URLs with paths, queries, and fragments
          "did:web:example.com/user/alice?version=1#keys-1",
          "did:example:123456789abcdefghi/path?query=value#fragment"
        ]

        for (const didUrl of validDidUrls) {
          expect(didUrl).toMatchSchema(schemas.DidUrlSchema)
        }
      })
    })

    describe("DidMethodSchema", () => {
      test("valid methods", () => {
        const validMethods = [
          "key",
          "web",
          "ethr",
          "ion",
          "jwk",
          "pkh",
          "example",
          "custommethod",
          "method123",
          "123method",
          "a",
          "z9"
        ]

        for (const method of validMethods) {
          expect(method).toMatchSchema(schemas.DidMethodSchema)
        }
      })

      test("invalid methods", () => {
        const invalidMethods = [
          "KEY", // Wrong case
          "Method", // Contains uppercase
          "method-name", // Contains dash
          "method_name", // Contains underscore
          "method.name", // Contains dot
          "method:name", // Contains colon
          "method name", // Contains space
          "method@name", // Contains special character
          ""
        ]

        for (const method of invalidMethods) {
          expect(method).not.toMatchSchema(schemas.DidMethodSchema)
        }
      })
    })

    describe("VerificationMethodSchema", () => {
      test("valid verification method", () => {
        const validVerificationMethod = {
          id: "did:example:123456789abcdefghi#keys-1",
          type: "JsonWebKey",
          controller: "did:example:123456789abcdefghi",
          publicKeyJwk: {
            kty: "EC",
            crv: "P-256",
            x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
            y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM",
            use: "sig",
            alg: "ES256"
          }
        }

        expect(validVerificationMethod).toMatchSchema(
          schemas.VerificationMethodSchema
        )
      })

      test("multikey verification method", () => {
        const verificationMethod = {
          id: "did:example:123456789abcdefghi#keys-1",
          type: "Multikey",
          controller: "did:example:123456789abcdefghi",
          publicKeyMultibase: "zQmWvQxTqbG2Z9HPJgG57jjwR2X9GrEJjQAC"
        }

        expect(verificationMethod).toMatchSchema(
          schemas.VerificationMethodSchema
        )
      })

      test("json web key verification method", () => {
        const verificationMethod = {
          id: "did:example:123456789abcdefghi#keys-1",
          type: "JsonWebKey",
          controller: "did:example:123456789abcdefghi",
          publicKeyJwk: {
            kty: "EC",
            crv: "P-256",
            x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
            y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
          }
        }

        expect(verificationMethod).toMatchSchema(
          schemas.VerificationMethodSchema
        )
      })

      test("legacy verification method", () => {
        const verificationMethod = {
          id: "did:example:123456789abcdefghi#keys-1",
          type: "JsonWebKey2020",
          controller: "did:example:123456789abcdefghi",
          publicKeyJwk: {
            kty: "EC",
            crv: "P-256",
            x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
            y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
          }
        }

        expect(verificationMethod).toMatchSchema(
          schemas.VerificationMethodSchema
        )
      })

      test("with publicKeyBase58", () => {
        const verificationMethod = {
          id: "did:example:123456789abcdefghi#keys-1",
          type: "Ed25519VerificationKey2020",
          controller: "did:example:123456789abcdefghi",
          publicKeyBase58: "H3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }

        expect(verificationMethod).toMatchSchema(
          schemas.VerificationMethodSchema
        )
      })
    })

    describe("ServiceSchema", () => {
      test("valid service endpoint", () => {
        const validService = {
          id: "did:example:123456789abcdefghi#vcs",
          type: "VerifiableCredentialService",
          serviceEndpoint: "https://example.com/vc"
        }

        expect(validService).toMatchSchema(schemas.ServiceSchema)
      })

      test("service with array endpoint", () => {
        const serviceWithArrayEndpoint = {
          id: "did:example:123456789abcdefghi#messaging",
          type: ["MessagingService", "DIDCommMessaging"],
          serviceEndpoint: [
            "https://example.com/messaging/1",
            "https://example.com/messaging/2"
          ]
        }

        expect(serviceWithArrayEndpoint).toMatchSchema(schemas.ServiceSchema)
      })

      test("service with object endpoint", () => {
        const serviceWithObjectEndpoint = {
          id: "did:example:123456789abcdefghi#dwn" as const,
          type: "DecentralizedWebNode",
          serviceEndpoint: {
            nodes: ["https://dwn.example.com", "https://dwn2.example.com"],
            auth: "bearer"
          }
        } as const

        expect(serviceWithObjectEndpoint).toMatchSchema(schemas.ServiceSchema)
      })
    })

    describe("DidDocumentSchema", () => {
      test("complete DID document", () => {
        const validDidDocument = {
          "@context": "https://www.w3.org/ns/did/v1",
          id: "did:example:123456789abcdefghi",
          verificationMethod: [
            {
              id: "did:example:123456789abcdefghi#keys-1",
              type: "JsonWebKey",
              controller: "did:example:123456789abcdefghi",
              publicKeyJwk: {
                kty: "EC",
                crv: "P-256",
                x: "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
                y: "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
              }
            }
          ],
          authentication: ["did:example:123456789abcdefghi#keys-1"],
          assertionMethod: ["did:example:123456789abcdefghi#keys-1"],
          service: [
            {
              id: "did:example:123456789abcdefghi#vcs",
              type: "VerifiableCredentialService",
              serviceEndpoint: "https://example.com/vc"
            }
          ]
        }

        expect(validDidDocument).toMatchSchema(schemas.DidDocumentSchema)
      })

      test("minimal DID document", () => {
        const minimalDidDocument = {
          "@context": "https://www.w3.org/ns/did/v1",
          id: "did:example:123456789abcdefghi"
        }

        expect(minimalDidDocument).toMatchSchema(schemas.DidDocumentSchema)
      })

      test("with multiple contexts", () => {
        const didDocumentWithMultipleContexts = {
          "@context": [
            "https://www.w3.org/ns/did/v1",
            "https://w3id.org/security/v2"
          ],
          id: "did:example:123456789abcdefghi"
        }

        expect(didDocumentWithMultipleContexts).toMatchSchema(
          schemas.DidDocumentSchema
        )
      })

      test("authentication with embedded verification method", () => {
        const didDocumentWithEmbeddedAuth = {
          "@context": "https://www.w3.org/ns/did/v1",
          id: "did:example:123456789abcdefghi",
          authentication: [
            {
              id: "did:example:123456789abcdefghi#auth-key",
              type: "Ed25519VerificationKey2020",
              controller: "did:example:123456789abcdefghi",
              publicKeyMultibase:
                "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
            }
          ]
        }

        expect(didDocumentWithEmbeddedAuth).toMatchSchema(
          schemas.DidDocumentSchema
        )
      })

      test("invalid DID documents", () => {
        const invalidDidDocuments = [
          {}, // Missing required fields
          { "@context": "https://www.w3.org/ns/did/v1" }, // Missing id
          { id: "did:example:123" }, // Missing @context
          { "@context": "https://www.w3.org/ns/did/v1", id: "not-a-did" }, // Invalid DID
          {
            "@context": "https://www.w3.org/ns/did/v1",
            id: "did:example:123",
            verificationMethod: "not-an-array" // Wrong type
          }
        ]

        for (const doc of invalidDidDocuments) {
          expect(doc).not.toMatchSchema(schemas.DidDocumentSchema)
        }
      })
    })

    test("fixture-based validation tests", () => {
      // Test valid DID Key string from fixture
      expect(didKeyValid).toMatchSchema(schemas.DidSchema)

      // Test valid DID Web string from fixture
      expect(didWebValid).toMatchSchema(schemas.DidSchema)

      // Test valid DID document from fixture
      expect(documentValid).toMatchSchema(schemas.DidDocumentSchema)

      // Test invalid DID with bad format
      expect(invalidBadFormat).not.toMatchSchema(schemas.DidSchema)
    })
  })
})
