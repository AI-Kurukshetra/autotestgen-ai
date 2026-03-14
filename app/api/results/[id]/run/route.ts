import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getExecutionSupport } from "@/lib/testExecution";
import { runGeneratedPlaywrightTest } from "@/lib/testRunner";
import type { TestGeneration } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data } = await supabase
      .from("test_generations")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    const result = data as TestGeneration | null;

    if (!result) {
      return NextResponse.json({ error: "Result not found." }, { status: 404 });
    }

    const support = getExecutionSupport(result.framework, result.language);

    if (!support.supported) {
      return NextResponse.json({ error: support.message }, { status: 400 });
    }

    const run = await runGeneratedPlaywrightTest(result.generated_code);

    return NextResponse.json(run);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected execution failure."
      },
      { status: 500 }
    );
  }
}
