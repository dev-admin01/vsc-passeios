/* eslint-disable import/no-anonymous-default-export */
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: ["node_modules", "dist", "**/*.d.ts"],

    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "node/no-unsupported-features/es-syntax": "off",
      "no-undef": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
