const FALLBACK_SUPABASE_URL = "https://vvtdgzcswhjcpjjorvjw.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGRnemNzd2hqY3Bqam9ydmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NjA0MTQsImV4cCI6MjA4OTAzNjQxNH0.nalQeefchby8ZsbNHMAcAKLBf2PZF4ssBDpPdc1Ma8g";

export function getSupabaseConfig() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    FALLBACK_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isFallback:
      !process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.SUPABASE_ANON_KEY
  };
}
