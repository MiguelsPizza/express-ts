import baseConfig from '@typed-router/tsup-config';
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  entry: ["./index.ts"],
  outDir: "./dist",

});
