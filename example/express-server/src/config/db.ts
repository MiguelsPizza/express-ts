import * as path from "node:path";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "@typed-router/shared-lib/schema";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

export type DB = PgliteDatabase<typeof schema> & {
  $client: PGlite;
};

export class Database {
  static instance: DB;

  private constructor() {} // Prevent direct construction

  static async initialize() {
    if (this.instance) {
      return this.instance;
    }

    try {
      const client = new PGlite();
      const db = drizzle({ client, schema });

      // Run migrations
      await migrate(db, {
        migrationsFolder: path.join(__dirname, "drizzle"),
      });

      // Seed database in development/test
      if (process.env.NODE_ENV !== "production") {
        await seedDatabase(db);
      }

      this.instance = db;
      return this.instance;
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }
}

const demoPosts: schema.NewPost[] = [
  {
    title: "First Demo Post",
    body: "This is the content of our first demo post.",
  },
  {
    title: "Second Demo Post",
    body: "Here's another interesting demo post.",
  },
  {
    title: "Third Demo Post",
    body: "And here's one more post to demonstrate the app.",
  },
] as const;

async function seedDatabase(db: ReturnType<typeof drizzle>) {
  try {
    await db.insert(schema.posts).values(demoPosts);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
