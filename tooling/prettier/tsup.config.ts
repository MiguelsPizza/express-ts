import baseConfig from "@express-ts/tsup-config";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  entry: ["./index.ts"],
  outDir: "./dist",
});
