import 'dotenv/config';
import { MongoMemoryServer } from "mongodb-memory-server";
import type mongoose from "mongoose";

export async function setUpTestDatabase(mongooseConnection: typeof mongoose): Promise<void> {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongooseConnection.connect(mongoUri);
}
