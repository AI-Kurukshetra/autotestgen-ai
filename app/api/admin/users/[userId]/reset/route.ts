import { NextResponse } from "next/server";

import { getPasswordUpdateUrl } from "@/lib/site-url";
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

    if (targetUserError || !targetUserData.user?.email) {
      return NextResponse.json({ error: "User email not found." }, { status: 404 });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(targetUserData.user.email, {
      redirectTo: getPasswordUpdateUrl()
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: `Password reset email sent to ${targetUserData.user.email}.`
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected admin reset failure."
      },
      { status: 500 }
    );
  }
}
