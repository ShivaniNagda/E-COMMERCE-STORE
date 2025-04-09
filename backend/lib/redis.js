import dotenv from "dotenv";
import Redis from "ioredis"
dotenv.config();

export const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL); //key value store 

await redis.set('foo', 'bar');