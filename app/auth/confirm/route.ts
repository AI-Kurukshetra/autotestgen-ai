import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function getSafeRedirectUrl(
  request: NextRequest,
  rawNext: string | null,
  fallbackPath: string
) {
  try {
    const nextUrl = new URL(rawNext || fallbackPath, request.url);

    if (nextUrl.origin !== request.nextUrl.origin) {
      return new URL(fallbackPath, request.url);
    }

    return nextUrl;
  } catch {
    return new URL(fallbackPath, request.url);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const fallbackPath = type === "recovery" ? "/auth/update-password" : "/dashboard";
  const redirectTo = getSafeRedirectUrl(
    request,
    searchParams.get("next"),
    fallbackPath
  );

  if (tokenHash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  const errorUrl = new URL("/auth/forgot-password", request.url);
  errorUrl.searchParams.set(
    "error",
    "Invalid or expired recovery link. Request a new password reset email."
  );
  return NextResponse.redirect(errorUrl);
}
