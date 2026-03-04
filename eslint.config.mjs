import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ["**/*.tsx", "**/*.ts"],
    ignores: ["e2e/**"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/set-state-in-effect": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      complexity: "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "playwright-report/**",
    "test-results/**",
    "e2e/**",
  ]),
]);

export default eslintConfig;
