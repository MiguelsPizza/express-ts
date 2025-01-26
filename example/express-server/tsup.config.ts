import { defineConfig } from "tsup";
import packageJSON from "./package.json";

export default defineConfig({
  entry: ["./src/index.ts", "./src/controllers/post.ts"],
  format: ["cjs"],
  target: "node2023",
  platform: "node",
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  bundle: true,
  dts: true,
  outDir: "./dist",
  tsconfig: "./tsconfig.json",
  // you'll want to replace this wil the name of your monorepo if you are using this example
  noExternal: Object.keys(packageJSON.dependencies).filter(dep => dep.includes("@typed-router")),
  esbuildOptions(options) {
    options.bundle = true;
    options.platform = "node";
  },
});
