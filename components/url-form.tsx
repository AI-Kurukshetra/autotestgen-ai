"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeferredValue, useState, useTransition } from "react";

import { FrameworkSelect } from "@/components/framework-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DomScanResult, Framework, GenerateResponse, Language } from "@/lib/types";

const frameworkOptions = ["Playwright", "Cypress", "Selenium"] as const;
const languageOptions = ["JavaScript", "Python", "Java", "C#"] as const;

export function UrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [framework, setFramework] = useState<Framework>("Playwright");
  const [language, setLanguage] = useState<Language>("JavaScript");
  const [domPreview, setDomPreview] = useState<DomScanResult | null>(null);
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deferredPreview = useDeferredValue(domPreview);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsWorking(true);

    try {
      const scanResponse = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      if (!scanResponse.ok) {
        const scanError = await scanResponse.json();
        throw new Error(scanError.error || "Unable to scan the page.");
      }

      const domStructure = (await scanResponse.json()) as DomScanResult;
      setDomPreview(domStructure);

      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          framework,
          language,
          domStructure
        })
      });

      if (!generateResponse.ok) {
        const generateError = await generateResponse.json();
        throw new Error(generateError.error || "Unable to generate tests.");
      }

      const result = (await generateResponse.json()) as GenerateResponse;

      startTransition(() => {
        router.push(`/results/${result.id}`);
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unexpected error while generating tests."
      );
    } finally {
      setIsWorking(false);
    }
  }

  const previewMetrics = deferredPreview
    ? [
        { label: "Buttons", value: deferredPreview.buttons.length },
        { label: "Inputs", value: deferredPreview.inputs.length },
        { label: "Forms", value: deferredPreview.forms.length },
        { label: "Links", value: deferredPreview.links.length }
      ]
    : [];

  return (
    <div className="space-y-6">
      <form className="panel p-6 sm:p-8" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <span className="eyebrow">Scan any production URL</span>
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
                Turn a live page into runnable automation scripts.
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-stone-600">
                AutoTestGen AI fetches the page, extracts interactive targets, and drafts
                a framework-specific test suite you can run immediately.
              </p>
            </div>
            <div className="space-y-3">
              <label
                className="font-mono text-xs uppercase tracking-[0.24em] text-stone-500"
                htmlFor="target-url"
              >
                Webpage URL
              </label>
              <Input
                id="target-url"
                inputMode="url"
                placeholder="https://example.com/login"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-stone-950 p-5 text-stone-50">
            <div className="space-y-5">
              <FrameworkSelect
                label="Framework"
                value={framework}
                options={frameworkOptions}
                onChange={setFramework}
              />
              <FrameworkSelect
                label="Language"
                value={language}
                options={languageOptions}
                onChange={setLanguage}
              />
              <Button
                className="w-full"
                variant="accent"
                size="lg"
                disabled={isWorking || isPending}
              >
                {isWorking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating suite...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Test
                  </>
                )}
              </Button>
              <p className="text-xs leading-5 text-stone-400">
                Best results come from publicly accessible URLs with stable selectors.
              </p>
            </div>
          </div>
        </div>
      </form>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {deferredPreview ? (
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel p-6">
            <p className="font-display text-2xl">Latest DOM Snapshot</p>
            <p className="mt-2 text-sm text-stone-600">{deferredPreview.pageTitle}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {previewMetrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                    {metric.label}
                  </p>
                  <p className="mt-2 font-display text-3xl">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-display text-2xl">Selector Preview</p>
                <p className="mt-2 text-sm text-stone-600">
                  First extracted interactive elements from the scanned page.
                </p>
              </div>
              <span className="rounded-full bg-stone-950 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-white">
                {framework}
              </span>
            </div>
            <div className="mt-6 space-y-3">
              {[
                ...deferredPreview.buttons.slice(0, 2),
                ...deferredPreview.inputs.slice(0, 2),
                ...deferredPreview.links.slice(0, 2)
              ].map((item) => (
                <div
                  key={`${item.selector}-${item.tag}`}
                  className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <p className="break-words font-medium text-stone-900">
                      {item.text || item.label || item.placeholder || item.tag}
                    </p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-2 overflow-x-auto font-mono text-xs text-stone-500">
                    {item.selector}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
