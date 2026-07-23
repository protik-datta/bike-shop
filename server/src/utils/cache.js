const redis = require("../config/redis.config");

const CACHE_TTL = 60 * 60;

const invalidateCache = async (category) => {
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      "products:*",
      "COUNT",
      100,
    );
    cursor = nextCursor;
    if (keys.length > 0) await redis.del(...keys);
  } while (cursor !== "0");

  if (category) {
    await redis.del(`category:${category}`);
  }
};

const clearCacheByPattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

module.exports = { invalidateCache, CACHE_TTL, clearCacheByPattern };
