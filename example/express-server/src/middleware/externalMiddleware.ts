import compression from "compression";
import cors from "cors";

import "dotenv/config";

import type { Application } from "express";
import express from "express";
import pinoHttp from "pino-http";

// import { datadogConnectMiddleware } from './datadog';
import logger, { redactPaths } from "../util/logger";

export function applyExternalMiddleware(app: Application) {
  // Set server port and IP
  app.set("port", 8888);
  app.set("ip", "http://localhost:");

  app.use(
    pinoHttp({
      logger,
      redact: {
        paths: redactPaths as unknown as string[],
        remove: true,
      },
    }),
  );

  // Body parsing middlewares
  app.use(express.json()); // Parse JSON bodies (as sent by API clients)
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(compression());

  // CORS configuration
  app.use(
    cors({
      origin: "*",
      methods: "*",
      allowedHeaders: "*",
    }),
  );
}
