const Redis = require("ioredis");
const logger = require("../utils/logger");

const redis = new Redis(process.env.REDIS_URI, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  logger.info("Connected to Redis successfully");
});

redis.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

module.exports = redis;
