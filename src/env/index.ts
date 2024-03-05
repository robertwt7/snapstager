import { ApiType, AppType } from "./types";

export const api: ApiType = {
  REPLICATE_API_KEY: process.env.REPLICATE_API_KEY ?? "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
  CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
  CLOUDFLARE_TOKEN: process.env.CLOUDFLARE_TOKEN ?? "",
  ZONE_ID: process.env.ZONE_ID ?? "",
};

export const app: AppType = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
