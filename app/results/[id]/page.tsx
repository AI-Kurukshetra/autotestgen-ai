import { ArrowLeft, CalendarClock, Globe2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CodeViewer } from "@/components/code-viewer";
import { TestRunPanel } from "@/components/test-run-panel";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
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
