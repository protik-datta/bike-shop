const redis = require("../config/redis.config");
const logger = require("./logger");

const CACHE_TTL = 60 * 60;

const invalidateCache = async (pattern) => {
  try {
    let cursor = "0";
    let totalDeleted = 0;

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = nextCursor;

      if (keys.length > 0) {
        const delCount = await redis.del(...keys);
        totalDeleted += delCount;
      }
    } while (cursor !== "0");

    logger.info(
      `[invalidateCache] total deleted for "${pattern}": ${totalDeleted}`,
    );
  } catch (error) {
    logger.error(`Cache Invalidation Error for pattern [${pattern}]:`, error);
  }
};

// Uses SCAN instead of KEYS to avoid blocking the Redis event loop in production
const clearCacheByPattern = async (pattern) => {
  try {
    let cursor = "0";
    const allKeys = [];

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = nextCursor;
      allKeys.push(...keys);
    } while (cursor !== "0");

    if (allKeys.length > 0) {
      await redis.del(...allKeys);
    }
  } catch (error) {
    logger.error(`clearCacheByPattern Error for pattern [${pattern}]:`, error);
  }
};

module.exports = { invalidateCache, CACHE_TTL, clearCacheByPattern };

