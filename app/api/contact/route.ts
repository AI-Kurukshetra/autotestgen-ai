import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      reason?: string;
    };

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim() || "";
    const message = body.message?.trim() || "";
    const reason = body.reason?.trim() || "general";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      reason
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Your message has been stored in Supabase and the admin team will review it shortly."
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected contact failure."
      },
      { status: 500 }
    );
  }
}
