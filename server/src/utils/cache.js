const redis = require("../config/redis.config");

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

      console.log(
        `[SCAN] cursor=${cursor} pattern=${pattern} found=${keys.length}`,
        keys,
      );

      if (keys.length > 0) {
        const delCount = await redis.del(...keys);
        totalDeleted += delCount;
        console.log(`[DEL] removed ${delCount} keys`);
      }
    } while (cursor !== "0");

    console.log(
      `[invalidateCache] total deleted for "${pattern}": ${totalDeleted}`,
    );
  } catch (error) {
    console.error(`Cache Invalidation Error for pattern [${pattern}]:`, error);
  }
};

const clearCacheByPattern = async (pattern) => {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
};

module.exports = { invalidateCache, CACHE_TTL, clearCacheByPattern };
