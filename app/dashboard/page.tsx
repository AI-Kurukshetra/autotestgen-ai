import Link from "next/link";
import { ArrowUpRight, Clock3, FileTerminal } from "lucide-react";
import { redirect } from "next/navigation";

import { UrlForm } from "@/components/url-form";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { TestGeneration } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: history } = await supabase
    .from("test_generations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <UrlForm />
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <span className="eyebrow">Operator notes</span>
            <h2 className="mt-4 font-display text-3xl tracking-tight">Generation checklist</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-600">
              <li>Use live URLs that allow server-side fetching.</li>
              <li>Stable selectors improve AI output quality and test resilience.</li>
              <li>Generated suites are stored against your authenticated account.</li>
            </ul>
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="eyebrow">History</span>
                <h2 className="mt-4 font-display text-3xl tracking-tight">
                  Recent test suites
                </h2>
              </div>
              <Clock3 className="h-5 w-5 text-stone-500" />
            </div>
            <div className="mt-6 space-y-3">
              {(history as TestGeneration[] | null)?.length ? (
                history!.map((item) => (
                  <Link
                    key={item.id}
                    href={`/results/${item.id}`}
                    className="block rounded-[24px] border border-black/10 bg-white/70 p-4 transition hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-stone-900">{item.url}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">
                          {item.framework} · {item.language}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-stone-400" />
                    </div>
                    <p className="mt-3 text-xs text-stone-500">{formatDate(item.created_at)}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-black/15 bg-white/60 p-5 text-sm text-stone-500">
                  No generated suites yet. Scan a URL to create your first saved result.
                </div>
              )}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <FileTerminal className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-2xl">Supported outputs</p>
                <p className="text-sm text-stone-600">
                  Playwright, Cypress, and Selenium
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
