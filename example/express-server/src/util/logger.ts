import "dotenv/config";

import pino from "pino";

const productionRedactPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  'res.headers["content-security-policy"]',
  'res.headers["cross-origin-opener-policy"]',
  'res.headers["cross-origin-resource-policy"]',
  'res.headers["origin-agent-cluster"]',
  'res.headers["referrer-policy"]',
  'res.headers["strict-transport-security"]',
  'res.headers["x-content-type-options"]',
  'res.headers["x-dns-prefetch-control"]',
  'res.headers["x-download-options"]',
  'res.headers["x-frame-options"]',
  'res.headers["x-permitted-cross-domain-policies"]',
  'res.headers["x-xss-protection"]',
];

const developmentRedactPaths = ["req.headers", "res.headers", "req.remoteAddress", "req.remotePort"];

const isProduction = process.env.NODE_ENV === "production";
const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

export const redactPaths = process.env.DEBUG === "true" ? developmentRedactPaths : productionRedactPaths;

const logger = pino({
  level: logLevel,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:standard",
          },
        }
      : undefined,
});

export default logger;
