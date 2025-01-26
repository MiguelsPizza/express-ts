import baseConfig from "@typed-router/eslint-config/base";
import reactConfig from "@typed-router/eslint-config/react";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
