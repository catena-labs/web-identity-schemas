---
globs: "*.ts, *.js, package.json"
alwaysApply: false
---

Default to using Bun instead of Node.js.

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>` or `yarn run <script>` or `pnpm run <script>`
- Bun automatically loads .env, so don't use dotenv.

## Testing

Use `bun test` to run tests.

```ts#index.test.ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

# Web Identity Schemas Project

This project provides TypeScript schemas and validation for Web Identity standards including DIDs, Verifiable Credentials, JWTs, and related cryptographic primitives. It supports both Valibot and Zod validation libraries.

## Commands

```bash
# Install dependencies
bun install

# Run tests (both valibot and zod)
bun test

# Run TypeScript type checking
bun run typecheck

# Run linting
bun run lint

# Run specific test file
bun test test/vc.test.ts
```

## Project Structure

- **`src/types/`** - TypeScript type definitions for all schemas
- **`src/valibot/`** - Valibot schema implementations
- **`src/zod/`** - Zod schema implementations
- **`src/constants/`** - Shared constants and enums
- **`test/`** - Test files covering both validation libraries
- **`test/fixtures/`** - JSON test fixtures for real-world data validation

## Key Patterns & Recent Changes

### Credential Type Schemas (Updated Pattern)

The project now uses relaxed credential type patterns that support both string and array formats:

```typescript
// Accepts: "VerifiableCredential" OR ["VerifiableCredential", ...string[]]
const relaxedPattern = z.union([
  z.literal("VerifiableCredential"),
  z
    .array(z.string())
    .min(1)
    .refine(
      (types) => types[0] === "VerifiableCredential",
      "First type must be VerifiableCredential"
    )
])
```

This pattern applies to both Verifiable Credentials and Verifiable Presentations.

### Service Endpoint Flexibility

DID service endpoints now support flexible value types to handle real-world use cases:

```typescript
// ServiceEndpointMap allows various value types
export interface ServiceEndpointMap {
  [key: string]: string | string[] | Uri | ServiceEndpointMap
}

// Example: DWN service endpoint
{
  "serviceEndpoint": {
    "nodes": ["https://dwn.example.com", "https://dwn2.example.com"],
    "auth": "bearer"
  }
}
```

### Context Validation Strategy

JSON-LD contexts use URI format validation with runtime logic for required contexts:

- **Type Level**: Just URIs (`string` or `string[]`)
- **Schema Level**: Validates URI format + checks for required contexts
- **Required contexts must be present somewhere in the array**

### Testing Patterns

When working with complex validation schemas, use proper type assertions instead of `any`:

```typescript
// ❌ Avoid
expect((parsed.credentialSubject as any).id).toBe("did:example:123")

// ✅ Use structured types
expect((parsed.credentialSubject as { id?: string }).id).toBe("did:example:123")

// ✅ For schema callbacks
expect(statusCredential).toMatchSchema(
  schemas.StatusCredentialSchema,
  (parsed: { credentialSubject: { type: string } }) => {
    expect(parsed.credentialSubject.type).toBe("StatusList2021")
  }
)
```

## Development Guidelines

### Type Safety First

- Always run `bun run typecheck` and `bun run lint` before commits
- Fix all TypeScript errors and linting warnings
- Use proper type assertions instead of `any` or `as` casting

### Schema Validation

- Both valibot and zod schemas must pass identical test suites
- Maintain consistency between the two validation approaches
- Test with real-world fixtures in `test/fixtures/`

### Debugging Failed Tests

1. Run specific test: `bun test test/vc.test.ts`
2. Check both valibot and zod implementations
3. Verify type definitions match schema outputs
4. Use proper error messages in custom validators

## Common Issues & Solutions

### JWS Format

JWS strings must follow the format `header.payload.signature`:

```typescript
// ✅ Valid JWS
"eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.signature"

// ❌ Invalid JWS
"eyJhbGciOiJFUzI1NiJ9..signature" // empty payload
```

### Schema Import Errors

If you get schema import errors, check:

1. All required schemas are exported from their modules
2. Import paths are correct (`../` vs `./`)
3. No circular dependencies between schema files

### Type Mismatches

When TypeScript complains about type mismatches:

1. Check if the schema output type matches the TypeScript interface
2. Verify generic type parameters are consistent
3. Use the appropriate `Shape<T>` or `ObjectShape<T>` pattern

## Schema Validation Patterns

### Type Safety Rules

- **NEVER use `as` for type casting** - This bypasses TypeScript's type checking and can lead to runtime errors
- **NEVER use `any` types** - Always specify proper types or use `unknown` if the type is truly unknown
- **Use proper custom validators** instead of forced type casting

### Valibot Patterns

For custom types, use `v.custom<ExpectedType>(() => true)`:

```ts
export const UriSchema = v.pipe(
  v.string(),
  v.regex(/^[a-zA-Z][a-zA-Z0-9+.-]*:.+/, "Must be a valid URI with scheme"),
  v.custom<Uri>(() => true)
)
```

For object schemas, use `satisfies Shape<T>` to ensure schema output matches expected interface:

```ts
export const ServiceSchema = v.object({
  id: UriSchema,
  type: v.union([v.string(), v.array(v.string())]),
  serviceEndpoint: ServiceEndpointSchema
} satisfies Shape<Service>)
```

**Why `satisfies` for valibot:**

- ✅ Preserves valibot's native methods like `.entries` for schema composition
- ✅ Compile-time type checking ensures schema matches expected output
- ✅ No runtime overhead
- ✅ Allows extending schemas with `...BaseSchema.entries`

### Zod Patterns

For custom types, use `z.custom<ExpectedType>()`:

```ts
export const UriSchema = z
  .string()
  .regex(/^[a-zA-Z][a-zA-Z0-9+.-]*:.+/, "Must be a valid URI with scheme")
  .pipe(z.custom<Uri>())
```

For object schemas, use `ObjectShape<T>` for schemas that need `.extend()` method:

```ts
// For schemas that need .extend() method
export const BaseJwkSchema: ObjectShape<BaseJwk> = z.object({
  kty: z.string(),
  use: z.optional(KeyUseSchema)
  // ... other fields
})

export const RsaJwkSchema: ObjectShape<RsaJwk> = BaseJwkSchema.extend({
  kty: z.literal("RSA"),
  n: Base64UrlSchema,
  e: Base64UrlSchema
  // ... RSA specific fields
})
```

For non-object schemas or those that don't need `.extend()`, use `Shape<T>`:

```ts
export const UnionSchema: Shape<MyUnion> = z.discriminatedUnion("type", [
  ItemSchema,
  OtherSchema
])
```

**Why ObjectShape vs Shape for zod:**

- ✅ `ObjectShape<T>` preserves `.extend()` method for object schemas
- ✅ `Shape<T>` for discriminated unions and non-object schemas
- ✅ Both provide compile-time + runtime type safety

### Benefits

- **Type Safety**: Ensures the output type matches the expected TypeScript type
- **Runtime Safety**: Validation still occurs, but with proper type annotation
- **Maintainability**: Clear intent and consistent patterns across the codebase
