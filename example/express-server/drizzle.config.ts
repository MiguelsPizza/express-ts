import type { Config } from 'drizzle-kit';

export default {
  schema: '../shared-lib/src/schema/index.ts',
  out: './src/config/drizzle/',
  dialect: 'postgresql',
  driver: 'pglite',
  verbose: true,
  strict: true,
} satisfies Config;