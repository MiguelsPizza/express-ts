import backendConfig from "@express-ts-rpc/eslint-config/backend";
import baseConfig from "@express-ts-rpc/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
