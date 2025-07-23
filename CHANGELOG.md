# web-identity-schemas

## 0.2.0

### Minor Changes

- c4076c2: Update Credentials to have a Credential type and a Verifiable<> type, which includes a proof.

  Update Credential "type" fields to allow any order of the types, per the spec

### Patch Changes

- 2c91623: [CHORE] Use test matchers from standard-parse

## 0.1.6

### Patch Changes

- 97f1594: Update isDidWithMethod to accpet method as first argument

## 0.1.5

### Patch Changes

- 4caf053: Add missing createDidSchema() method to zod.
  Add isDid(), isDidWithMethod() helpers to valibot and zod
