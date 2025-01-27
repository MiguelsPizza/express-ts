import baseConfig from "@express-ts/eslint-config/base";
import reactConfig from "@express-ts/eslint-config/react";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
