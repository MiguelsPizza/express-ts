import baseConfig, { ConfigArr } from "@express-ts/eslint-config/base";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
] as ConfigArr;
