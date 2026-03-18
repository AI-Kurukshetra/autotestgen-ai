"use client";

import { useEffect, useState } from "react";

import type { AiProvider } from "@/lib/types";

const PROVIDER_LABELS: Record<AiProvider, string> = {
  groq: "Groq (free, fast)",
  openai: "OpenAI (paid)",
  gemini: "Google Gemini (free tier)"
};

type AdminAppSettingsProps = {
  initialProvider: AiProvider;
};

export function AdminAppSettings({ initialProvider }: AdminAppSettingsProps) {
  const [aiProvider, setAiProvider] = useState<AiProvider>(initialProvider);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAiProvider(initialProvider);
  }, [initialProvider]);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings/ai-provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ai_provider: aiProvider })
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error || "Failed to update AI provider.");
      }

      setMessage(result.message || "AI provider updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unexpected error while saving settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel p-6">
      <div className="space-y-2">
        <span className="eyebrow">Model routing</span>
        <h2 className="font-display text-2xl tracking-tight">AI provider</h2>
        <p className="text-sm leading-7 text-stone-600">
          Choose which backend powers test generation. Set the matching API key in .env: GROQ_API_KEY,
          GEMINI_API_KEY, or OPENAI_API_KEY. See docs/API_KEYS.md for how to get free keys.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-stone-800">
          Active provider
          <select
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none ring-offset-2 focus:ring-2 focus:ring-primary/50"
            value={aiProvider}
            onChange={(event) => setAiProvider(event.target.value as AiProvider)}
          >
            <option value="groq">{PROVIDER_LABELS.groq}</option>
            <option value="gemini">{PROVIDER_LABELS.gemini}</option>
            <option value="openai">{PROVIDER_LABELS.openai}</option>
          </select>
        </label>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.45)] transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:bg-stone-700"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      </div>
    </section>
  );
}

