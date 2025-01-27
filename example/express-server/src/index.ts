import express from "express";

import { Database } from "./config/db";
import postRouter from "./controllers/post";
import errorHandler from "./middleware/error";
import { applyExternalMiddleware } from "./middleware/externalMiddleware";
import logger from "./util/logger";

const app = express();

applyExternalMiddleware(app);

app.use("/api", postRouter.routes());

app.use(errorHandler);

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Server startup
async function startServer() {
  await Database.initialize();

  const port = app.get("port");
  const ip = app.get("ip");

  app.listen(port, () => {
    logger.info(`Server running at ${ip}${port}`);
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
