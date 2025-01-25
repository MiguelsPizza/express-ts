import compression from 'compression';
import cors from 'cors';
import 'dotenv/config';
import type { Application } from 'express';
import express from 'express';
import pinoHttp from 'pino-http';

// import { datadogConnectMiddleware } from './datadog';
import logger, { developmentRedactPaths } from '../util/logger';

export function applyExternalMiddleware(app: Application) {
  // Set server port and IP
  app.set('port', 3000);
  app.set('ip', 'http://localhost:');

  app.use(
    pinoHttp({
      logger,
      redact: {
        paths: developmentRedactPaths as unknown as string[],
        remove: true,
      },
    })
  );

  // Body parsing middlewares
  app.use(express.json({ limit: '1mb' })); // Parse JSON bodies (as sent by API clients)
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
  app.use(compression());

  // CORS configuration
  app.use(cors({ allowedHeaders: ['Authorization', 'Content-Type'] }));
}
