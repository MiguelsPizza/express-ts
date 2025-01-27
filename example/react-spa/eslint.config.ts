import baseConfig from "@express-ts-rpc/eslint-config/base";
import reactConfig from "@express-ts-rpc/eslint-config/react";

export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
