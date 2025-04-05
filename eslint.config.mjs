import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore patterns for dependencies
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "public/**"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Disable specific rules
  {
    rules: {
      "react-hooks/exhaustive-deps": "off" // Disable the exhaustive-deps rule
    }
  }
];

export default eslintConfig;
