import * as s from "standard-parse"
import { expect } from "vitest"

interface ExpectationResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

interface StandardSchemaTestMatchers<R = unknown> {
  toMatchSchema<TOutput>(
    schema: s.Schema<unknown, TOutput>,
    additionalChecks?: (parsed: TOutput) => void
  ): R
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends StandardSchemaTestMatchers<T> {}
}

function toMatchSchema<TOutput>(
  this: unknown, // MatcherContext
  received: unknown,
  schema: s.Schema<unknown, TOutput>,
  additionalChecks?: (parsed: TOutput) => void
): ExpectationResult {
  const result = s.safeParse(schema, received)

  if (result.issues) {
    return {
      pass: false,
      message: () =>
        `Expected ${JSON.stringify(received)} to match schema.\n${formatIssues(result.issues)}`,
      actual: result.issues,
      expected: undefined
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
