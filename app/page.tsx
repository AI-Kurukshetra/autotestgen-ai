import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Building2,
  Bug,
  DollarSign,
  Download,
  GitBranch,
  Globe,
  ScanLine,
  ShieldCheck,
  TestTube2,
  Users,
  Zap
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillars = [
  {
    icon: ScanLine,
    title: "Automated DOM analysis",
    copy:
      "Cheerio-powered extraction identifies forms, buttons, links, navigation, and modal structures without manual selector hunting."
  },
  {
    icon: TestTube2,
    title: "Framework-ready output",
    copy:
      "Generate suites for Playwright, Cypress, or Selenium in JavaScript, Python, Java, or C# from a single scan."
  },
  {
    icon: Bug,
    title: "Edge and negative paths",
    copy:
      "The generator is tuned to include happy-path coverage plus sensible failure and edge-case handling when the page structure allows it."
  },
  {
    icon: Download,
    title: "Export and handoff",
    copy:
      "Copy or download generated scripts so they can move directly into repos, QA workflows, or delivery checklists."
  },
  {
    icon: ShieldCheck,
    title: "Saved generation history",
    copy:
      "Authenticated users keep a persistent record of generated suites inside their workspace for reuse and iteration."
  },
  {
    icon: GitBranch,
    title: "CI/CD-ready positioning",
    copy:
      "Generated outputs are structured for pipeline use, with team collaboration and API-based integration positioned as the next product layer."
  }
];

const audiences = [
  {
    icon: Users,
    title: "QA engineers and testers",
    copy: "Cut repetitive authoring work and move faster from URL to executable coverage."
  },
  {
    icon: Braces,
    title: "Frontend and full-stack developers",
    copy: "Create a usable regression baseline without building every selector and flow by hand."
  },
  {
    icon: Building2,
    title: "Software teams",
    copy: "Standardize framework output and reduce the time between shipping UI and validating it."
  },
  {
    icon: Zap,
    title: "Lean startups",
    copy: "Get QA leverage early when dedicated automation resources are still limited."
  }
];

const workflow = [
  {
    step: "01",
    title: "Scan a live URL",
    copy: "Submit a public page and let the platform inspect interactive structure across the DOM."
  },
  {
    step: "02",
    title: "Choose stack and language",
    copy: "Select Selenium, Playwright, or Cypress and match the output to your engineering environment."
  },
  {
    step: "03",
    title: "Generate runnable coverage",
    copy: "Receive production-oriented tests with selectors, flows, and assertions ready for handoff."
  }
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    cadence: "/month",
    status: "Current MVP position",
    featured: false,
    bullets: [
      "Limited page scans",
      "Single-user workflow",
      "Download generated scripts"
    ]
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    status: "Monetization target",
    featured: true,
    bullets: [
      "Unlimited scans",
      "Priority generation workflow",
      "Power-user QA velocity"
    ]
  },
  {
    name: "Team",
    price: "Custom",
    cadence: "",
    status: "Roadmap",
    featured: false,
    bullets: [
      "Collaboration features",
      "Shared visibility across suites",
      "Team-oriented workspace controls"
    ]
  },
  {
    name: "API",
    price: "Usage-based",
    cadence: "",
    status: "Roadmap",
    featured: false,
    bullets: [
      "CI/CD pipeline access",
      "Programmatic generation flows",
      "Integration-first delivery model"
    ]
  }
];

const faqs = [
  {
    question: "What is already live in this MVP?",
    answer:
      "Signup, login, page scanning, multi-framework generation, result download, generation history, and admin controls are already implemented in the current product."
  },
  {
    question: "Does the app support real billing yet?",
    answer:
      "Not yet. The pricing section reflects the monetization strategy defined in the project document, while the current build is positioned as the product-ready MVP."
  },
  {
    question: "Can I use generated suites in CI/CD today?",
    answer:
      "You can already export and move the generated scripts into your own repositories and pipelines. Direct API-based CI/CD access is positioned as a next-layer product feature."
  },
  {
    question: "What kind of pages work best?",
    answer:
      "Pages that are publicly reachable from the server and use stable selectors work best. The generator can only reason over what the scan can reliably extract."
  }
];

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
        <div className="space-y-6 sm:space-y-8">
          <span className="eyebrow">AI-powered automated test suite generator</span>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-5xl leading-[0.94] tracking-[-0.05em] text-stone-950 sm:text-7xl lg:text-[6.2rem]">
              AutoTestGen AI
            </h1>
            <p className="max-w-2xl text-base leading-7 text-stone-700 sm:text-lg sm:leading-8">
              Generate production-ready automation suites from any webpage in minutes,
              not days.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-stone-600">
              Scan a page, extract its interactive structure, and turn it into runnable
              Selenium, Playwright, or Cypress coverage for modern QA pipelines.s
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className={cn(
                buttonVariants({ variant: "accent", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Start Generating
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Open Dashboard
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-black/10 bg-white/75 px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Frameworks
              </p>
              <p className="mt-2 font-display text-3xl text-stone-950">3</p>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white/75 px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Languages
              </p>
              <p className="mt-2 font-display text-3xl text-stone-950">4</p>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white/75 px-4 py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Workflow
              </p>
              <p className="mt-2 font-display text-3xl text-stone-950">Scan → Code</p>
            </div>
          </div>
        </div>

        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-40" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-stone-950 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white">
                Live generation
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-stone-500">
                dom → infer → export
              </span>
            </div>

            <div className="rounded-[24px] border border-black/10 bg-white/90 p-5">
              <div className="flex items-start gap-3">
                <Globe className="mt-1 h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <p className="break-all font-medium text-stone-900">
                    https://example.com/login
                  </p>
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
                  Output stack
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
  await expect(page).toHaveURL(/dashboard/)
})`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel p-6">
          <span className="eyebrow">Problem statement</span>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            Test authoring is still a drag on release speed.
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            QA teams still spend too much time inspecting pages, identifying selectors,
            and scripting repetitive paths by hand. That slows release cycles and adds
            cost, especially for teams without large QA capacity.
          </p>
        </div>

        <div className="panel p-6">
          <span className="eyebrow">Our solution</span>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            AutoTestGen AI converts UI structure into runnable coverage.
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Submit a URL, analyze the DOM, and generate framework-specific automation
            code with practical assertions, export-ready files, and a clear path into
            CI/CD workflows.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <span className="eyebrow">Built for</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Teams that need QA leverage fast
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <div key={audience.title} className="panel p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{audience.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{audience.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <span className="eyebrow">Key features</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            What the product definition says this platform should deliver
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <div key={pillar.title} className="panel p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{pillar.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="panel p-6">
          <span className="eyebrow">Workflow</span>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            From webpage to automation suite in three steps
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            The platform is designed as a compact QA pipeline: scan, interpret, and
            ship generated code into the next stage of your delivery process.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <div key={item.step} className="panel p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Step {item.step}
              </p>
              <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <span className="eyebrow">Pricing</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Monetization structure from the project definition
          </h2>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            The PDF explicitly defines a free tier, a $19/month Pro plan, team
            collaboration, and API access for CI/CD. The cards below position those
            offers on the landing page while making clear which layers are roadmap
            versus current MVP packaging.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {pricing.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "panel flex h-full flex-col p-6",
                plan.featured ? "border-primary/40 bg-white shadow-orange-200/40" : ""
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-3xl">{plan.name}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                    {plan.status}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white">
                  {plan.name === "Pro" ? (
                    <DollarSign className="h-5 w-5" />
                  ) : plan.name === "Team" ? (
                    <Users className="h-5 w-5" />
                  ) : plan.name === "API" ? (
                    <GitBranch className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="font-display text-5xl tracking-tight">{plan.price}</p>
                {plan.cadence ? (
                  <p className="mt-1 text-sm text-stone-500">{plan.cadence}</p>
                ) : null}
              </div>

              <div className="mt-6 space-y-3">
                {plan.bullets.map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[20px] border border-black/10 bg-white/70 px-4 py-3 text-sm text-stone-700"
                  >
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href={user ? "/dashboard" : "/auth/signup"}
                  className={cn(
                    buttonVariants({
                      variant: plan.featured ? "accent" : "outline",
                      size: "default"
                    }),
                    "w-full rounded-2xl"
                  )}
                >
                  {plan.name === "Free"
                    ? "Start free workspace"
                    : plan.name === "Pro"
                      ? "Use the MVP now"
                      : "Join from the MVP"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="panel p-6">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            Questions a new user will ask first
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            The product document is ambitious. This section makes the live MVP scope
            easier to understand before someone signs up and starts scanning URLs.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.question} className="panel p-6">
              <h3 className="font-display text-2xl">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel relative overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-30" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow">Next step</span>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Start with the current MVP and turn UI surfaces into automation coverage.
            </h2>
            <p className="text-sm leading-7 text-stone-600">
              From a user perspective, the core value is already here: authenticate,
              scan, generate, export, and revisit saved suites. The next product layer
              is monetization, collaboration, and API delivery.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={user ? "/dashboard" : "/auth/signup"}
              className={cn(
                buttonVariants({ variant: "accent", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Create workspace
            </Link>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto"
              )}
            >
              Explore the app
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
