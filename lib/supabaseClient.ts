"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseConfig();

  browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  return browserClient;
}
