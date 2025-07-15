import { expect } from "bun:test"
import * as s from "standard-parse"
import type { MatcherResult } from "bun:test"

interface StandardSchemaTestMatchers {
  toMatchSchema<TOutput>(
    schema: s.Schema<unknown, TOutput>,
    additionalChecks?: (parsed: TOutput) => void
  ): void
}

declare module "bun:test" {
  interface Matchers extends StandardSchemaTestMatchers {}
  interface AsymmetricMatchers extends StandardSchemaTestMatchers {}
}

function toMatchSchema<TOutput>(
  this: unknown, // MatcherContext
  received: unknown,
  schema: s.Schema<unknown, TOutput>,
  additionalChecks?: (parsed: TOutput) => void
): MatcherResult {
  const result = s.safeParse(schema, received)

  if (result.issues) {
    return {
      pass: false,
      message: () =>
        `Expected ${JSON.stringify(received)} to match schema.\n${formatIssues(result.issues)}`
    }
  }

  if (additionalChecks) {
    additionalChecks(result.value)
  }

  return {
    pass: true,
    message: () => `Expected ${JSON.stringify(received)} not to match schema`
  }
}

function formatIssues(issues: readonly s.Issue[]): string {
  return issues
    .map((issue) => {
      const pathKeys = issue.path?.map((p) =>
        typeof p === "object" ? p.key : p
      )
      const path = pathKeys ? `${pathKeys.join(".")}:` : ""
      return `  - ${path} ${issue.message}`
    })
    .join("\n")
}

expect.extend({
  toMatchSchema
})
