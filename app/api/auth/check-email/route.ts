import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/supabase/admin";
import { getSupabaseServiceRoleKey } from "@/lib/env";

type CheckEmailRequest = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckEmailRequest;
    const email = body.email?.trim().toLowerCase() || "";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (!getSupabaseServiceRoleKey()) {
      return NextResponse.json({ exists: false });
    }

    const existingUser = await findUserByEmail(email);

    return NextResponse.json({
      exists: Boolean(existingUser)
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to check email availability."
      },
      { status: 500 }
    );
  }
}
