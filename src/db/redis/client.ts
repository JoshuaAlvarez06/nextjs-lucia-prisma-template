import { env } from "@/env";
import { Redis } from "@upstash/redis";

class RedisSingleton {
  client: Redis | undefined;

  constructor() {
    this.client = undefined;
  }

  getInstance(): Redis {
    if (!this.client)
      this.client = new Redis({
        url: env.UPSTASH_REDIS_URL,
        token: env.UPSTASH_REDIS_TOKEN,
      });
    return this.client;
  }
}

export const redis = new RedisSingleton().getInstance();
