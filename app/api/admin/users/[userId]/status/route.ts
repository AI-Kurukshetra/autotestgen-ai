import { NextResponse } from "next/server";

import { createAdminClient, getCurrentUserRole } from "@/lib/supabase/admin";

const ADMIN_BAN_DURATION = "876000h";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { user, role } = await getCurrentUserRole();

    if (!user || role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (user.id === params.userId) {
      return NextResponse.json(
        { error: "Admin users cannot disable their own account." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: targetUserData, error: targetUserError } =
      await supabase.auth.admin.getUserById(params.userId);

    if (targetUserError || !targetUserData.user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", params.userId)
      .maybeSingle();

    if (roleRow?.role === "admin") {
      return NextResponse.json(
        { error: "Admin accounts cannot be disabled from this action." },
        { status: 400 }
      );
    }

    const body = (await request.json()) as { disabled?: boolean };
    const shouldDisable = Boolean(body.disabled);

    const { error } = await supabase.auth.admin.updateUserById(params.userId, {
      ban_duration: shouldDisable ? ADMIN_BAN_DURATION : "none"
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: shouldDisable ? "User account disabled." : "User account enabled."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected admin status failure."
      },
      { status: 500 }
    );
  }
}
