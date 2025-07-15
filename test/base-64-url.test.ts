import { test, expect, describe } from "bun:test"
import * as valibot from "../src/valibot"
import * as zod from "../src/zod"

const namespaces = {
  valibot,
  zod
}

describe("base64url", () => {
  describe.each(Object.entries(namespaces))("%s", (namespace, schemas) => {
    describe("Base64UrlSchema", () => {
      test("valid inputs", () => {
        const validInputs = [
          "SGVsbG8", // "Hello"
          "V29ybGQ", // "World"
          "Zm9vYmFy", // "foobar"
          "YQ", // "a"
          "YWI", // "ab"
          "YWJj", // "abc"
          "YWJjZA", // "abcd"
          "YWJjZGU", // "abcde"
          "YWJjZGVm", // "abcdef"
          "SGVsbG9fV29ybGQtMTIz", // "Hello_World-123"
          "QWJDZEVmR2hJaktsTm1PcFFyU3RVdld4WXo", // Mixed case base64url
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", // JWT header
          "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw", // RSA n parameter
          "AQAB", // RSA e parameter (common value)
          // Empty string is actually invalid base64url for our schema
          "abc123_ABC-", // Mixed alphanumeric with URL-safe chars
          "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK" // DID key identifier
        ]

        for (const input of validInputs) {
          expect(input).toMatchSchema(schemas.Base64UrlSchema)
        }
      })

      test("invalid inputs", () => {
        const invalidInputs = [
          "Hello+World", // Contains + (base64 char, not base64url)
          "Hello/World", // Contains / (base64 char, not base64url)
          "Hello=World", // Contains = in middle
          "Hello World", // Contains space
          "Hello\nWorld", // Contains newline
          "Hello\tWorld", // Contains tab
          "Hello@World", // Contains @
          "Hello#World", // Contains #
          "Hello$World", // Contains $
          "Hello%World", // Contains %
          "Hello&World", // Contains &
          "Hello*World", // Contains *
          "Hello(World)", // Contains parentheses
          "Hello[World]", // Contains brackets
          "Hello{World}", // Contains braces
          "Hello|World", // Contains pipe
          "Hello\\World", // Contains backslash
          'Hello"World"', // Contains quotes
          "Hello'World'", // Contains single quotes
          "Hello;World", // Contains semicolon
          "Hello:World", // Contains colon
          "Hello,World", // Contains comma
          "Hello.World", // Contains period
          "Hello?World", // Contains question mark
          "Hello!World", // Contains exclamation
          "SGVsbG8=", // Standard base64 with padding
          "SGVsbG8==", // Standard base64 with padding
          "bad$$value", // Invalid characters
          "" // Empty string is invalid
        ]

        for (const input of invalidInputs) {
          expect(input).not.toMatchSchema(schemas.Base64UrlSchema)
        }
      })

      test("non-string inputs", () => {
        const nonStringInputs = [
          null,
          undefined,
          123,
          true,
          false,
          {},
          [],
          Symbol("base64url"),
          new Date(),
          /regex/,
          () => {
            return "base64url"
          }
        ]

        for (const input of nonStringInputs) {
          expect(input).not.toMatchSchema(schemas.Base64UrlSchema)
        }
      })
    })
  })
})
