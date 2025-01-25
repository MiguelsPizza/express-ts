import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["cjs"],
  target: "node2023",
  platform: "node",
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  bundle: true,
  dts: false,
  outDir: "./dist",
  tsconfig: "./tsconfig.json",
  noExternal: [
    // Include all @typed-router packages
    "types",
    "@typed-router/validators",
    "@typed-router/auth",
    "@typed-router/models",
    "@typed-router/common-lib",
  ],
  esbuildOptions(options) {
    options.bundle = true;
    options.platform = "node";
  },
});
