import backendConfig from "@typed-router/eslint-config/backend";
import baseConfig from "@typed-router/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
