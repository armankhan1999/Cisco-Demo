import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Disable all ESLint rules globally
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "off",
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "prefer-const": "off",
      "no-unused-vars": "off",
      "no-console": "off",
      "no-debugger": "off",
      "no-empty": "off",
      "no-undef": "off",
      "no-unreachable": "off",
      "no-constant-condition": "off",
      "no-case-declarations": "off",
      "no-fallthrough": "off",
      "no-redeclare": "off",
      "no-inner-declarations": "off",
      "no-useless-escape": "off",
      "no-prototype-builtins": "off",
      "no-irregular-whitespace": "off",
      "no-mixed-spaces-and-tabs": "off",
      "no-extra-semi": "off",
      "no-unexpected-multiline": "off",
      "no-sparse-arrays": "off",
      "no-func-assign": "off",
      "no-duplicate-case": "off",
      "no-dupe-keys": "off",
      "no-empty-character-class": "off",
      "no-ex-assign": "off",
      "no-extra-boolean-cast": "off",
      "no-extra-parens": "off",
      "no-invalid-regexp": "off",
      "no-obj-calls": "off",
      "no-regex-spaces": "off",
      "no-unsafe-finally": "off",
      "no-unsafe-negation": "off",
      "use-isnan": "off",
      "valid-typeof": "off"
    },
  },
];

export default eslintConfig;
