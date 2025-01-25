import "dotenv/config";

import type mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export async function setUpTestDatabase(mongooseConnection: typeof mongoose): Promise<void> {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongooseConnection.connect(mongoUri);
}
