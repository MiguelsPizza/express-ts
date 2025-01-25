import pino from "pino";

const logger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export const developmentRedactPaths = ["req.headers", "res.headers", "req.remoteAddress", "req.remotePort"] as const;

export default logger;
