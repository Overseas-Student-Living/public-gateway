import * as Redis from "ioredis";
import { getLogger } from "../logger";
import { asyncMiddleware } from "../utils";

const ONE_DAY = 60 * 60 * 24;
const logger = getLogger("redis");

/**
 * Set up redis connection
 */
export const redis =
  process.env.SCHEMA_SAVING === "true"
    ? new Proxy({ on: () => void 0 }, {})
    : new Redis(
        parseInt(process.env.REDIS_PORT, 10) || 6379,
        process.env.REDIS_SERVER,
        {
          db: parseInt(process.env.REDIS_DB, 10)
        }
      );

redis.on("connect", () => {
  logger.info(
    `redis connect on ${process.env.REDIS_SERVER}:${process.env.REDIS_PORT ||
      6379}/${process.env.REDIS_DB}`
  );
});

export interface CacheStore {
  get(key: string): Promise<any>;
  set(key: string, value: any, maxAge: number): Promise<void>;
  destroy(key: string): Promise<void>;
}

export const cacheStore: CacheStore = {
  async get(key: string) {
    const res = await redis.get(key);
    if (!res) {
      return null;
    }
    return JSON.parse(res);
  },
  async set(key: string, value: any, maxAge?: number) {
    const settedMaxAge = maxAge || ONE_DAY;
    const storedValue = JSON.stringify(value);
    await redis.set(key, storedValue, "EX", settedMaxAge);
  },

  async destroy(key: string) {
    await redis.del(key);
  }
};

export function cacheContextMiddleware_(req, _, next) {
  req.cache = cacheStore;
  next();
}

export const cacheContextMiddleware = asyncMiddleware(cacheContextMiddleware_);
