import { defineConfig } from "tsup";

import packageJSON from "./package.json";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["cjs"],
  target: "node2024",
  platform: "node",
  sourcemap: true,
  clean: true,
  treeshake: false,
  minify: false,
  bundle: false,
  outDir: "./dist",
  experimentalDts: {
    entry: "./src/index.ts",
  },
  tsconfig: "./tsconfig.json",
  // you'll want to replace this wil the name of your monorepo if you are using this example
  noExternal: Object.keys(packageJSON.dependencies).filter((dep) => dep.includes("@express-ts")),
  esbuildOptions(options) {
    options.bundle = true;
    options.platform = "node";
  },
});
