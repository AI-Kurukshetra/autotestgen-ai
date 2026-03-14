import { NextResponse } from "next/server";

import { createAdminClient, getCurrentUserRole } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { user, role } = await getCurrentUserRole();

    if (!user || role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    if (user.id === params.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own admin account from this panel." },
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
        { error: "Admin accounts cannot be deleted from this action." },
        { status: 400 }
      );
    }

    const { error } = await supabase.auth.admin.deleteUser(params.userId);

    if (error) {
      throw error;
    }

    await supabase.from("user_roles").delete().eq("user_id", params.userId);

    return NextResponse.json({
      message: `User ${targetUserData.user.email} deleted.`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected admin delete failure."
      },
      { status: 500 }
    );
  }
}
