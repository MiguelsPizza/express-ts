import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  driver: "pglite",
  verbose: true,
  strict: true,
} satisfies Config;
