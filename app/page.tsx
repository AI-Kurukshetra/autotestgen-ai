import Link from "next/link";
import { ArrowRight, Braces, Globe, ScanLine, ShieldCheck, TestTube2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: ScanLine,
    title: "DOM scanner",
    copy: "Cheerio-powered extraction identifies interactive targets across forms, links, navigation, and modals."
  },
  {
    icon: TestTube2,
    title: "Framework output",
    copy: "Generate suites for Playwright, Cypress, or Selenium in JavaScript, Python, Java, or C#."
  },
  {
    icon: ShieldCheck,
    title: "Saved history",
    copy: "Every generated test suite is persisted in Supabase for authenticated users."
  }
];

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:px-10 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="space-y-8">
          <span className="eyebrow">AI-powered test generation</span>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-6xl leading-[0.94] tracking-[-0.05em] text-stone-950 sm:text-7xl lg:text-[6.5rem]">
              AutoTestGen AI
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-700">
              Generate automated test suites instantly from any webpage.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              Paste a URL, let the platform scan the DOM, and receive runnable QA
              scripts tailored for modern automation frameworks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-40" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-stone-950 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white">
                Control panel
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-stone-500">
                scan → infer → export
              </span>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white/90 p-5">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-stone-900">https://example.com/login</p>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-stone-500">
                    public target URL
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="metric-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                  Interactive nodes
                </p>
                <p className="mt-3 font-display text-4xl">42</p>
              </div>
              <div className="metric-card bg-primary text-primary-foreground">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-primary-foreground/70">
                  Target stack
                </p>
                <p className="mt-3 font-display text-4xl">PW</p>
              </div>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-stone-950 p-5 text-stone-50">
              <div className="flex items-center gap-3 text-primary">
                <Braces className="h-4 w-4" />
                <p className="font-mono text-xs uppercase tracking-[0.24em]">
                  Generated output
                </p>
              </div>
              <pre className="mt-4 overflow-x-auto font-mono text-xs leading-6 text-stone-300">
{`test('login flow', async ({ page }) => {
  await page.goto('https://example.com/login')
  await page.fill('#email', 'qa@example.com')
  await page.fill('#password', 'secret')
  await page.click('button[type="submit"]')
})`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 font-display text-2xl">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">{pillar.copy}</p>
            </div>
          );
        })}
      </section>
    </main>
  );
}
