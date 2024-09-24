import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest", // ECMAScript version
      sourceType: "module",  // Source type as module
      parser: typescriptParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        console: "readonly",
        fetch: "readonly",
        MutationObserver: "readonly",
      },
      parserOptions: {
        jsx: true, // Enabling JSX parsing
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "react": reactPlugin,
    },
    rules: {
      "no-console": "off",
      "no-prototype-builtins": "error",
      "no-cond-assign": "error",
      "no-fallthrough": "error",
      "no-empty": "warn",
      "no-undef": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "valid-typeof": "error",
      "no-useless-escape": "error",
      "no-self-assign": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

///////////////// IT WORKS IT WORKS/////////////////////////////////