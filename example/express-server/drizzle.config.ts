import type { Config } from 'drizzle-kit';

export default {
  schema: './src/models/index.ts',
  out: './src/config/drizzle/',
  dialect: 'postgresql',
  driver: 'pglite',
  verbose: true,
  strict: true,
} satisfies Config;