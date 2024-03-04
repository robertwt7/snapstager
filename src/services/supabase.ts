import { createClient } from "@supabase/supabase-js";
import { app } from "src/env";

const supabaseUrl = app.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = app.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseSingleton = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

declare global {
  // eslint-disable-next-line no-var
  var supabase: undefined | ReturnType<typeof supabaseSingleton>;
}

export const supabase = globalThis.supabase ?? supabaseSingleton();

if (process.env.NODE_ENV !== "production") globalThis.supabase = supabase;
