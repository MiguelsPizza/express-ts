import backendConfig from "@typed-router/eslint-config/backend";
import baseConfig from "@typed-router/eslint-config/base";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...backendConfig,
];
