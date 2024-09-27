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
        ...globals.jest, // Adding Jest globals for testing
        console: "readonly",
        fetch: "readonly",
        MutationObserver: "readonly",
        // Add more global variables as needed
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
      "no-unused-vars": [
        "warn", 
        { 
          argsIgnorePattern: "^_",  // Ignore unused function arguments that start with "_"
          varsIgnorePattern: "^_",  // Ignore unused variables that start with "_"
        }
      ],
      "valid-typeof": "error",
      "no-useless-escape": "error",
      "no-self-assign": "error",
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    // Ignoring specific directories and patterns
    ignores: [
      "**/coverage/**",  // Ignore all files in coverage directory, including nested files
      "**/node_modules/**",  // Ignore all files in node_modules
      "**/dist/**",  // Ignore build output directory
      "**/build/**",  // Ignore build output directory
      "**/public/**",  // Ignore public directory for assets
      ".husky/**",  // Ignore husky configuration files
      ".vscode/**",  // Ignore Visual Studio Code settings folder
    ],
  },
];
