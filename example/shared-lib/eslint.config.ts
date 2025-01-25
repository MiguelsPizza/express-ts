import baseConfig, { ConfigArr } from '@typed-router/eslint-config/base';

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
] as ConfigArr;
