import "dotenv/config";

import type { PostObject } from "@typed-router/shared-lib/model-types";
import type mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { Post } from "../models/post";

export async function setUpTestDatabase(mongooseConnection: typeof mongoose): Promise<void> {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongooseConnection.connect(mongoUri);
  await seedDatabase();
}

const demoPosts: Omit<PostObject, "_id" | "createdAt" | "updatedAt">[] = [
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
];

export async function seedDatabase(): Promise<void> {
  try {
    await Post.insertMany(demoPosts);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
