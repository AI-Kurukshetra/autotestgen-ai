import { PassThrough } from "node:stream";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import archiver from "archiver";

import { createClient } from "@/lib/supabase/server";
import { getFileExtension } from "@/lib/utils";
import { PLAYWRIGHT_RUN_STEPS } from "@/lib/runInstructions";

export const runtime = "nodejs";

const PLAYWRIGHT_CONFIG_CJS = `const chromePath = process.env.PLAYWRIGHT_CHROME_PATH;

const use = {
  headless: true,
  ignoreHTTPSErrors: true,
  actionTimeout: 15000,
  navigationTimeout: 30000
};

if (chromePath) {
  use.launchOptions = { executablePath: chromePath };
}

module.exports = {
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 45000,
  workers: 1,
  use
};
`;

function looksLikeEsm(code: string) {
  return /^\s*import\s/m.test(code) || /^\s*export\s/m.test(code);
}

function safeSegment(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w.-]/g, "-");
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("test_generations")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Generation not found or access denied." },
        { status: 404 }
      );
    }

    const framework = data.framework as string;
    const language = data.language as string;
    const url = data.url as string;
    const code = data.generated_code as string;
    const ext = getFileExtension(language);
    const safeFramework = safeSegment(framework);
    const safeHost = new URL(url).hostname.replace(/[^\w.-]/g, "-");
    const isPlaywrightJs =
      framework === "Playwright" && language === "JavaScript";
    const baseName = `${safeFramework}-${safeHost}`;
    const zipBaseFolder = `${baseName}-tests`;

    const archive = archiver("zip", { zlib: { level: 9 } });
    const passThrough = new PassThrough();
    archive.pipe(passThrough);

    if (isPlaywrightJs) {
      const isEsm = looksLikeEsm(code);
      const pkg = {
        name: baseName,
        version: "1.0.0",
        private: true,
        scripts: {
          test: "playwright test",
          "test:headed": "playwright test --headed",
          "test:ui": "playwright test --ui",
          "install:browsers": "playwright install",
        },
        devDependencies: {
          "@playwright/test": "^1.58.2",
        },
        ...(isEsm ? { type: "module" as const } : {}),
      };

      archive.append(JSON.stringify(pkg, null, 2), {
        name: `${zipBaseFolder}/package.json`,
      });
      archive.append(PLAYWRIGHT_CONFIG_CJS, {
        name: `${zipBaseFolder}/playwright.config.cjs`,
      });
      archive.append(code, {
        name: `${zipBaseFolder}/tests/generated.spec.js`,
      });
      archive.append(PLAYWRIGHT_RUN_STEPS, {
        name: `${zipBaseFolder}/README.md`,
      });
    } else {
      archive.append(code, {
        name: `${zipBaseFolder}/${baseName}.${ext}`,
      });
      archive.append(
        [
          `# ${framework} test — ${safeHost}`,
          "",
          "This archive contains a single generated test file.",
          "Runnable project ZIP (with config and run steps) is available only for **Playwright + JavaScript**.",
          "",
          "For this framework/language:",
          "1. Use the single-file **Download** from the app to get the test file.",
          "2. Add it to your existing project and run with your framework’s runner.",
          "",
          "For a ready-to-run folder with step-by-step Playwright instructions, generate a **Playwright** suite in **JavaScript** and use **Download as ZIP**.",
          "",
        ].join("\n"),
        { name: `${zipBaseFolder}/README.md` }
      );
    }

    archive.finalize();

    const filename = `${baseName}-tests.zip`;
    const webStream = Readable.toWeb(passThrough) as ReadableStream;
    return new Response(webStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to build download.",
      },
      { status: 500 }
    );
  }
}
