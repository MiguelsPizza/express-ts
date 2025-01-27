import backendConfig from "@express-ts/eslint-config/backend";
import baseConfig from "@express-ts/eslint-config/base";

export default [
  {
    ignores: ["dist/**", ".tsup/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
