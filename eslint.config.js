// @ts-check

import js from "@eslint/js"
import prettier from "eslint-config-prettier/flat"
import tseslint from "typescript-eslint"
import gitignore from "eslint-config-flat-gitignore"

export default tseslint.config(
  gitignore(),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/no-empty-object-type": [
        "warn",
        {
          allowInterfaces: "with-single-extends"
        }
      ],
      "@typescript-eslint/no-redundant-type-constituents": "off"
    }
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off"
    }
  },
  prettier
)
