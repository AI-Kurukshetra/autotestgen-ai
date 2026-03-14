import { NextResponse } from "next/server";

import { scanUrl } from "@/lib/domParser";

function normalizeUrl(url: string) {
  const parsed = new URL(url);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  return parsed.toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json({ error: "A valid URL is required." }, { status: 400 });
    }

    const url = normalizeUrl(rawUrl);
    const domStructure = await scanUrl(url);

    return NextResponse.json(domStructure);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected scan failure."
      },
      { status: 500 }
    );
  }
}
