import baseConfig, { ConfigArr } from "@express-ts-rpc/eslint-config/base";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
] as ConfigArr;
