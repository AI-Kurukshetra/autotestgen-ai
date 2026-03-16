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

    const supabase = createAdminClient();
    const { data: targetUserData, error: targetUserError } =
      await supabase.auth.admin.getUserById(params.userId);

    if (targetUserError || !targetUserData.user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (targetUserData.user.email_confirmed_at) {
      return NextResponse.json(
        { message: "Email already confirmed." },
        { status: 200 }
      );
    }

    const { error } = await supabase.auth.admin.updateUserById(params.userId, {
      email_confirm: true
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "User email confirmed."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to confirm user email."
      },
      { status: 500 }
    );
  }
}
