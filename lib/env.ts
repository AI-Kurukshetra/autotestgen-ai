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

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
}

export function getContactEmail() {
  return process.env.CONTACT_EMAIL || "sankit.parasiya@bacancy.com";
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const from = process.env.SMTP_FROM || user || "";

  return {
    host,
    port,
    user,
    pass,
    from,
    enabled: Boolean(host && user && pass && from)
  };
}
