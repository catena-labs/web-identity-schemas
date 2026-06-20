import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.ts"],
    passWithNoTests: true,
    watch: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html"],
    },
  },
})
