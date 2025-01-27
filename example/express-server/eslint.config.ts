import backendConfig from "@express-ts-rpc/eslint-config/backend";
import baseConfig from "@express-ts-rpc/eslint-config/base";

export default [
  {
    ignores: ["dist/**", ".tsup/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
