"use client";

import { formatDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/types";

const reasonMeta: Record<
  string,
  { label: string; accent: string; description: string }
> = {
  disabled: {
    label: "Access recovery",
    accent: "text-red-600",
    description: "Users requesting help to restore disabled accounts."
  },
  general: {
    label: "General inquiry",
    accent: "text-amber-600",
    description: "General questions and notes from visitors."
  }
};

type AdminContactSubmissionsProps = {
  messages: ContactMessage[];
};

export function AdminContactSubmissions({ messages }: AdminContactSubmissionsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-stone-200 bg-gradient-to-br from-white to-stone-50 p-5 shadow-lg shadow-amber-200/30">
        <p className="font-display text-lg tracking-tight text-stone-900">Support inbox</p>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Every contact form submission since launch is stored here with the full message
          body so you can triage requests without leaving the admin console.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.4em] text-stone-500">
          <span className="rounded-full bg-stone-900/5 px-3 py-1 font-semibold text-stone-700">
            {messages.length} stored messages
          </span>
          <span className="text-stone-400">Ordered by most recent</span>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="rounded-[26px] border-2 border-dashed border-stone-300 bg-white/70 p-8 text-center text-sm font-medium text-stone-500">
            No contact form submissions yet. They will appear here once someone shares feedback.
          </div>
        ) : (
          messages.map((message) => {
            const meta = reasonMeta[message.reason] ?? reasonMeta.general;

            return (
              <div
                key={message.id}
                className="relative overflow-hidden rounded-[32px] border border-black/5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/80 p-6 text-white shadow-[0_25px_70px_rgba(5,7,15,0.7)]"
              >
                <div className="absolute inset-0 opacity-60" aria-hidden>
                  <div className="pointer-events-none h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(248,113,113,0.35),_transparent_60%)]" />
                </div>
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-display text-xl tracking-tight text-white">
                        {message.subject}
                      </p>
                      <p className="text-sm text-white/70">
                        From {message.name} · {message.email}
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.32em] text-white/70">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
                    <span className="rounded-full border border-white/30 px-3 py-1 text-[11px]">
                      {meta.label}
                    </span>
                    <span className={meta.accent}>{message.reason}</span>
                  </div>
                  <p className="text-sm leading-7 text-white/80">{message.message}</p>
                  <div className="rounded-2xl bg-white/5 px-4 py-3 text-xs text-white/70">
                    {meta.description}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
