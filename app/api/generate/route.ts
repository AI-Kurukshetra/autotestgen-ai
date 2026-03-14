import { NextResponse } from "next/server";

import { generateAutomationTest } from "@/lib/aiGenerator";
import { scanUrl } from "@/lib/domParser";
import { createClient } from "@/lib/supabase/server";
import type { DomScanResult, Framework, Language } from "@/lib/types";

const frameworks = new Set<Framework>(["Playwright", "Cypress", "Selenium"]);
const languages = new Set<Language>(["JavaScript", "Python", "Java", "C#"]);

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const url = typeof body?.url === "string" ? new URL(body.url).toString() : null;
    const framework = body?.framework as Framework;
    const language = body?.language as Language;

    if (!url || !frameworks.has(framework) || !languages.has(language)) {
      return NextResponse.json(
        { error: "URL, framework, and language are required." },
        { status: 400 }
      );
    }

    const domStructure =
      (body?.domStructure as DomScanResult | undefined) || (await scanUrl(url));

    const generatedCode = await generateAutomationTest({
      url,
      framework,
      language,
      domStructure
    });

    const { data, error } = await supabase
      .from("test_generations")
      .insert({
        user_id: user.id,
        url,
        framework,
        language,
        generated_code: generatedCode
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to store generated test.");
    }

    return NextResponse.json({
      id: data.id,
      code: generatedCode
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected generation failure."
      },
      { status: 500 }
    );
  }
}
