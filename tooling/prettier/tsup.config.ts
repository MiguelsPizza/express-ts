import baseConfig from "@express-ts-rpc/tsup-config";
import { defineConfig } from "tsup";

export default defineConfig({
  ...baseConfig,
  entry: ["./index.ts"],
  outDir: "./dist",
});
