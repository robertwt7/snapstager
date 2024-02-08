import { createClient } from "@supabase/supabase-js";
import { app } from "src/env";

const supabaseUrl = app.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = app.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
