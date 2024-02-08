import { Redis } from "@upstash/redis";
import { api } from "src/env";

const redis =
  !!api.UPSTASH_REDIS_REST_URL && !!api.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: api.UPSTASH_REDIS_REST_URL,
        token: api.UPSTASH_REDIS_REST_TOKEN,
      })
    : undefined;

export default redis;
