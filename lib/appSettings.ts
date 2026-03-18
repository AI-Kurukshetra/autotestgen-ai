import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AiProvider, AppSettings } from "@/lib/types";

const SETTINGS_KEY = "app";
const DEFAULT_SETTINGS: AppSettings = {
  ai_provider: "groq"
};

export async function getAppSettings(): Promise<AppSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error || !data?.value) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...(data.value as Partial<AppSettings>)
  };
}

export async function updateAppSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const supabase = createAdminClient();
  const current = await getAppSettings();
  const next: AppSettings = {
    ...current,
    ...patch
  };

  const { error } = await supabase.from("app_settings").upsert(
    {
      key: SETTINGS_KEY,
      value: next
    },
    {
      onConflict: "key"
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return next;
}

