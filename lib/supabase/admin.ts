import "server-only";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getSupabaseConfig, getSupabaseServiceRoleKey } from "@/lib/env";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";

export function createAdminClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!serviceRoleKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY for admin features.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getCurrentUserRole() {
  const supabase = createServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: "user" as UserRole };
  }

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    user,
    role: (data?.role as UserRole | undefined) || "user"
  };
}

export async function requireAdminUser() {
  const { user, role } = await getCurrentUserRole();

  if (!user) {
    redirect("/auth/login?next=/admin");
  }

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return user;
}
