import { NextResponse } from "next/server";

import { updateAppSettings } from "@/lib/appSettings";
import { requireAdminUser } from "@/lib/supabase/admin";
import type { AiProvider } from "@/lib/types";

export async function POST(request: Request) {
  try {
    await requireAdminUser();

    const body = (await request.json()) as { ai_provider?: AiProvider };
    const provider = body.ai_provider;

    if (!provider || !["groq", "openai", "gemini"].includes(provider)) {
      return NextResponse.json(
        { error: "Invalid AI provider." },
        { status: 400 }
      );
    }

    const next = await updateAppSettings({ ai_provider: provider });

    return NextResponse.json({
      message: "AI provider updated.",
      settings: next
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update AI provider."
      },
      { status: 500 }
    );
  }
}

