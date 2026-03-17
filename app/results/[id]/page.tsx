import { ArrowLeft, CalendarClock, FileArchive, Globe2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CodeViewer } from "@/components/code-viewer";
import { TestRunPanel } from "@/components/test-run-panel";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { PLAYWRIGHT_RUN_STEPS_SUMMARY } from "@/lib/runInstructions";
import type { TestGeneration } from "@/lib/types";

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data } = await supabase
    .from("test_generations")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  const result = data as TestGeneration | null;

  if (!result) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        {/* <TestRunPanel
          resultId={result.id}
          framework={result.framework}
          language={result.language}
        /> */}

        <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
          <div className="space-y-4">
            <div className="panel p-6">
              <span className="eyebrow">Generated suite</span>
              <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                {result.framework}
              </h1>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Exported in {result.language} for the scanned target below.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full sm:w-auto transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md"
                asChild
              >
                <a
                  href={`/api/results/${result.id}/download-zip`}
                  className="inline-flex items-center justify-center gap-2"
                  download
                >
                  <FileArchive className="h-4 w-4" />
                  Download as ZIP
                </a>
              </Button>
              <p className="mt-2 text-xs text-stone-500">
                Runnable test folder with README and run steps (Playwright JS).
              </p>
            </div>

            <div className="panel p-6">
              <div className="space-y-4 text-sm text-stone-600">
                <div className="flex items-start gap-3">
                  <Globe2 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-stone-900">Target URL</p>
                    <p className="mt-1 break-all">{result.url}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-stone-900">Generated at</p>
                    <p className="mt-1">{formatDate(result.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {result.framework === "Playwright" && result.language === "JavaScript" ? (
              <div className="panel p-6">
                <span className="eyebrow">How to run after download</span>
                <h2 className="mt-4 font-display text-xl tracking-tight">
                  Playwright steps (README inside ZIP)
                </h2>
                <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-stone-600">
                  <li>Unzip the file and open the folder in a terminal.</li>
                  <li>Install deps: <code className="rounded bg-stone-200 px-1">npm install</code></li>
                  <li>Install browsers (one-time): <code className="rounded bg-stone-200 px-1">npm run install:browsers</code></li>
                  <li>
                    Run tests — headless: <code className="rounded bg-stone-200 px-1">npm test</code>
                    {" "}or open browser and watch: <code className="rounded bg-stone-200 px-1">npm run test:headed</code>
                  </li>
                  <li>Interactive UI: <code className="rounded bg-stone-200 px-1">npm run test:ui</code></li>
                </ol>
                <p className="mt-3 text-xs font-medium text-stone-700">
                  Open browser and perform test cases
                </p>
                <pre className="mt-1 overflow-x-auto rounded-2xl border border-black/10 bg-stone-100 px-4 py-3 text-xs text-stone-800">
                  {PLAYWRIGHT_RUN_STEPS_SUMMARY}
                </pre>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 overflow-auto">
            <CodeViewer
              code={result.generated_code}
              framework={result.framework}
              language={result.language}
              url={result.url}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
