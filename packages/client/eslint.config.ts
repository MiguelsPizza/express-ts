import baseConfig, { ConfigArr } from "@express-ts-rpc/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
] as ConfigArr;
