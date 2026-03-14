"use client";

import { AlertTriangle, CheckCircle2, Loader2, Play, Terminal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getExecutionSupport } from "@/lib/testExecution";
import type { TestRunResponse } from "@/lib/types";

type TestRunPanelProps = {
  resultId: string;
  framework: string;
  language: string;
};

export function TestRunPanel({
  resultId,
  framework,
  language
}: TestRunPanelProps) {
  const support = getExecutionSupport(framework, language);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [runResult, setRunResult] = useState<TestRunResponse | null>(null);

  async function handleRun() {
    setIsRunning(true);
    setError("");

    try {
      const response = await fetch(`/api/results/${resultId}/run`, {
        method: "POST"
      });
      const result = (await response.json()) as TestRunResponse & { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to execute this suite.");
      }

      setRunResult(result);
    } catch (runError) {
      setRunResult(null);
      setError(
        runError instanceof Error ? runError.message : "Unexpected execution failure."
      );
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-black/10 bg-stone-950 px-6 py-5 text-stone-50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
              Execution
            </span>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Run this suite
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-stone-300">
              {support.message}
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            variant="accent"
            className="w-full shrink-0 lg:w-auto"
            disabled={!support.supported || isRunning}
            onClick={handleRun}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Test
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="rounded-[24px] border border-black/10 bg-white/70 px-4 py-4">
          <div className="flex flex-col gap-3 text-sm text-stone-600 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-stone-900">Execution target</p>
              <p className="mt-1">
                {framework} · {language}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${
                support.supported
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {support.supported ? "Runnable here" : "Preview only"}
            </span>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-[24px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {runResult ? (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-black/10 bg-white/70 px-4 py-4">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${
                  runResult.status === "passed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {runResult.status === "passed" ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {runResult.status}
              </span>
              <p className="text-sm text-stone-700">{runResult.summary}</p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-black/10 bg-stone-950 text-stone-100">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <Terminal className="h-4 w-4" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-400">
                  Run logs
                </p>
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-stone-200">
                {runResult.logs}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
