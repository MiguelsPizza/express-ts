import "dotenv/config";

import pino from "pino";
import PinoPretty from "pino-pretty";

const _ = PinoPretty; // so the linter does not auto remove
export const developmentRedactPaths = [
  "req.headers", // This will redact all headers
  "req.remoteAddress",
  "req.remotePort",
  "res.headers",
];

// good defaults if you base are using this example for a real world app
// const productionRedactPaths = [
//   "req.headers.authorization",
//   "req.headers.cookie",
//   'res.headers["content-security-policy"]',
//   'res.headers["cross-origin-opener-policy"]',
//   'res.headers["cross-origin-resource-policy"]',
//   'res.headers["origin-agent-cluster"]',
//   'res.headers["referrer-policy"]',
//   'res.headers["strict-transport-security"]',
//   'res.headers["x-content-type-options"]',
//   'res.headers["x-dns-prefetch-control"]',
//   'res.headers["x-download-options"]',
//   'res.headers["x-frame-options"]',
//   'res.headers["x-permitted-cross-domain-policies"]',
//   'res.headers["x-xss-protection"]',
// ];

// const isProduction = process.env.NODE_ENV === "production";
// const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

// export const redactPaths = process.env.DEBUG === "true" ? developmentRedactPaths : productionRedactPaths;

const logger = pino({
  level: "trace",
  transport: {
    target: "pino-pretty",
  },
  redact: {
    paths: developmentRedactPaths,
    remove: true,
  },
  // good for prod apps, not need for the demo
  // formatters: {
  //   level: (label) => {
  //     return { level: label.toUpperCase() };
  //   },
  // },
  // timestamp: pino.stdTimeFunctions.isoTime,
  // base: {
  //   env: process.env.NODE_ENV,
  //   version: process.env.npm_package_version,
  // },
  // transport:
  //   process.env.NODE_ENV !== "production"
  //     ? {
  //         target: "pino-pretty",
  //         options: {
  //           colorize: true,
  //           ignore: "pid,hostname",
  //           translateTime: "SYS:standard",
  //         },
  //       }
  //     : undefined,
});

export default logger;
