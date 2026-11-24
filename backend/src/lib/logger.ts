import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.password",
      "req.body.confirmPassword",
      "req.body.currentPassword",
      "req.body.newPassword",
      "req.body.token",
      "res.headers['set-cookie']",
      "password",
      "passwordHash",
      "token",
      "tokenHash",
      "session",
    ],
    censor: "[REDACTED]",
  },
  transport: env.isProd ? undefined : { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:standard" } },
});
