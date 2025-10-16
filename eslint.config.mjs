// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
}, {
  rules: {
    // === Custom Rules for Code Quality ===

    // Forbid direct localStorage usage - use storage service instead
    "no-restricted-globals": [
      "error",
      {
        name: "localStorage",
        message: "Use tokenStorage from '@/lib/storage' instead of direct localStorage access.",
      },
    ],

    // Forbid console.log in production code (except console.error/warn)
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],

    // Prefer const over let when variable is never reassigned
    "prefer-const": "error",

    // Disallow unused variables (except when prefixed with _ or named 'error')
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^(_|error)",
        caughtErrorsIgnorePattern: "^(_|error)",
      },
    ],

    // Enforce explicit return types on functions (disabled - too verbose for React)
    "@typescript-eslint/explicit-function-return-type": "off",

    // Forbid any type (warn instead of error to allow gradual migration)
    "@typescript-eslint/no-explicit-any": "warn",

    // Require consistent type imports
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],

    // Enforce hook dependencies
    "react-hooks/exhaustive-deps": "warn",

    // Disallow usage of alert, confirm, prompt (warn for now)
    "no-alert": "warn",

    // Require === instead of ==
    "eqeqeq": ["error", "always"],

    // Disallow var, enforce let/const
    "no-var": "error",

    // Prefer template literals over string concatenation
    "prefer-template": "warn",

    // Disallow magic numbers (disabled - too noisy)
    "no-magic-numbers": "off",
  },
}, {
  // Allow localStorage in test files and storage.ts itself
  files: ["**/__tests__/**", "**/storage.ts", "**/__mocks__/**", "**/setup.ts"],
  rules: {
    "no-restricted-globals": "off",
    "no-magic-numbers": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
