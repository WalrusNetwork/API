import redis from "redis";
import { promisify } from "util";

// eslint-disable-next-line
declare class process {
  static env: {
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
  };
}

export const Redis = redis.createClient({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
});

export const getAsync = promisify(Redis.get).bind(Redis);
export const hgetallAsync = promisify(Redis.hgetall).bind(Redis);

export default Redis;
