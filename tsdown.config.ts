import { defineConfig } from "tsdown/config"

export default defineConfig({
  entry: ["src/index.ts", "src/valibot.ts", "src/zod.ts"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  minify: true,
  external: ["valibot", "zod"]
})
