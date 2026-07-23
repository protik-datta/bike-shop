const winston = require("winston");
const path = require("path");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  }),
);

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // console output (dev + production)
    new winston.transports.Console(),

    // error logs
    new winston.transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
    }),

    // all logs
    new winston.transports.File({
      filename: path.join("logs", "combined.log"),
    }),
  ],

  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join("logs", "exceptions.log"),
    }),
  ],
});

module.exports = logger;
