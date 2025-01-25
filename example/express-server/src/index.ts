import express from "express";
import mongoose from "mongoose";

import { setUpTestDatabase } from "./config/db";
import postRouter from "./controllers/post";
import errorHandler from "./middleware/error";
import { applyExternalMiddleware } from "./middleware/externalMiddleware";
import logger from "./util/logger";

const app = express();

// Apply middleware
applyExternalMiddleware(app);

// Apply routes
app.use("/api", postRouter.routes());

// Error handling middleware should be last
app.use(errorHandler);

// Database connection
async function connectToDatabase() {
  try {
    await setUpTestDatabase(mongoose);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Server startup
async function startServer() {
  await connectToDatabase();

  const port = app.get("port");
  const ip = app.get("ip");

  app.listen(port, () => {
    logger.info(`Server running at ${ip}${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
