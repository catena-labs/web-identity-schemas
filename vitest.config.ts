import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.ts"],
    passWithNoTests: true,
    watch: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      // Type-only modules (no runtime to execute) and barrel re-exports.
      exclude: [
        "src/types/**",
        "src/**/index.ts",
        "src/{index,valibot,zod}.ts",
      ],
      reporter: ["text", "html"],
    },
  },
})
