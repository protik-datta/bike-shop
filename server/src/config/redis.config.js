const Redis = require("ioredis");
const logger = require("../utils/logger");

let client = null;
if (process.env.REDIS_URI) {
  try {
    client = new Redis(process.env.REDIS_URI, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // Stop retrying on failure
    });
    client.on("error", (err) => {
      // Suppress unhandled error events from crashing node
    });
  } catch (e) {
    client = null;
  }
}

const FALLBACKS = {
  get: null,
  set: "OK",
  del: 0,
  scan: ["0", []],
  keys: [],
  ping: "PONG",
  quit: "OK",
  connect: Promise.resolve(),
};

const dummyRedis = {
  get: async () => null,
  set: async () => "OK",
  del: async () => 0,
  scan: async () => ["0", []],
  keys: async () => [],
  ping: async () => "PONG",
  quit: async () => "OK",
  connect: async () => {},
  on: () => {},
  once: () => {},
  off: () => {},
  emit: () => {},
};

const resilientRedis = new Proxy(client || dummyRedis, {
  get(target, prop) {
    if (!client) {
      const fallback = FALLBACKS[prop];
      return typeof target[prop] === "function" ? target[prop] : (fallback !== undefined ? () => Promise.resolve(fallback) : () => Promise.resolve(null));
    }

    const original = target[prop];
    if (typeof original !== "function") return original;

    if (["on", "once", "off", "emit", "removeListener"].includes(prop)) {
      return original.bind(target);
    }

    return async (...args) => {
      try {
        if (client.status !== "ready" && prop !== "connect" && prop !== "disconnect") {
          return FALLBACKS[prop] !== undefined ? FALLBACKS[prop] : null;
        }
        return await original.apply(target, args);
      } catch (err) {
        return FALLBACKS[prop] !== undefined ? FALLBACKS[prop] : null;
      }
    };
  },
});

module.exports = resilientRedis;
