import backendConfig from "@express-ts/eslint-config/backend";
import baseConfig from "@express-ts/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
