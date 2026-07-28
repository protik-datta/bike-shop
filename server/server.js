const app = require("./app");
const logger = require("./src/utils/logger");

const connectDB = require("./src/config/db.config");
const redis = require("./src/config/redis.config");

const PORT = process.env.PORT || 3000;

// Catch uncaught exceptions — log them cleanly without immediately crashing node in dev
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
});

const startServer = async () => {
  try {
    // Attempt Redis connection (optional — server runs fine without it)
    try {
      await redis.connect();
      logger.info("[Redis] Connected successfully");
    } catch (redisErr) {
      logger.warn(`[Redis] Unavailable — server will run without caching: ${redisErr.message}`);
    }

    await connectDB();

    // start server
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    // Graceful shutdown: finish in-flight requests before exiting
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received — starting graceful shutdown`);
      server.close(() => {
        logger.info("HTTP server closed");
        redis.quit().finally(() => {
          logger.info("Redis connection closed");
          process.exit(0);
        });
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error("Graceful shutdown timed out — forcing exit");
        process.exit(1);
      }, 10_000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

