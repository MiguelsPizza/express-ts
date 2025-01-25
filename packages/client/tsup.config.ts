import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],  // Build for both CommonJS and ES Modules
  dts: true,  // Generate declaration files
  splitting: true,
  bundle: true,
  sourcemap: true,
  clean: true,  // Clean output directory before build
  minify: true,
  treeshake: true,  // Enable tree shaking
  external: ["express"],  // Don't bundle express
});