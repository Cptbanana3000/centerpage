import { Ratelimit } from "@upstash/ratelimit";
import Redis from "ioredis";

// Create a new redis client instance.
// The ioredis library will automatically use the REDIS_URL from your .env.local file.
let redis;
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  // This will give a clear error if the REDIS_URL is missing.
  throw new Error("REDIS_URL is not defined in your environment variables.");
}

// A stricter rate limiter for the most expensive endpoint: the analysis itself.
// Allows 1 request per 10 second window.
export const analysisRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "10 s"),
  analytics: true,
  prefix: "ratelimit:analysis",
});

// A stricter rate limiter for the premium proxy endpoints.
// Allows 1 request per 30 second window.
export const premiumActionRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(1, "30 s"),
  analytics: true,
  prefix: "ratelimit:premium",
});