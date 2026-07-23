const app = require("./app");
const logger = require("./src/utils/logger");

const connectDB = require("./src/config/db.config");
const redis = require("./src/config/redis.config");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await redis.ping();

    await connectDB();

    // start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
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
