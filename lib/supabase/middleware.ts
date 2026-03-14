import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig, getSupabaseServiceRoleKey } from "@/lib/env";

function isUserBanned(bannedUntil?: string | null): boolean {
  return (
    Boolean(bannedUntil) && new Date(bannedUntil!).getTime() > Date.now()
  );
}

export async function updateSession(request: NextRequest) {
  const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseConfig();
  const pathname = request.nextUrl.pathname;

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({
          request
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Check banned_until from Auth Admin API so already-logged-in users are
  // detected when admin disables them (JWT does not include banned_until).
  let isDisabled = isUserBanned(user?.banned_until);
  if (user && !isDisabled) {
    const serviceRoleKey = getSupabaseServiceRoleKey();
    if (serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      const { data: adminUser } =
        await adminClient.auth.admin.getUserById(user.id);
      isDisabled = isUserBanned(adminUser?.user?.banned_until);
    }
  }

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin");
  const isAuthPage = pathname.startsWith("/auth");

  if (user && isDisabled) {
    await supabase.auth.signOut();

    if (pathname === "/contact") {
      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/contact";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("reason", "disabled");

    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/admin") && user) {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
