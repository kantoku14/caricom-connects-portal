import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  // Configuration for linting JavaScript files
  js.configs.recommended,
  
  // Configuration for linting TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      typescript,
    },
    rules: {
      "typescript/no-unused-vars": "error",
      "typescript/no-explicit-any": "warn",
    },
  },
  // Configuration for common rules applied to both JavaScript and TypeScript files
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
