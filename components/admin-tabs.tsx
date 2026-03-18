"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { AdminConsole } from "@/components/admin-console";
import { AdminAppSettings } from "@/components/admin-app-settings";
import type { AiProvider } from "@/lib/types";
import { AdminContactSubmissions } from "@/components/admin-contact-submissions";
import type { AdminUserView, ContactMessage } from "@/lib/types";

type AdminTabsProps = {
  users: AdminUserView[];
  currentUserId: string;
  contactMessages: ContactMessage[];
  aiProvider: AiProvider;
};

const tabDefinitions = [
  {
    id: "users",
    title: "User console",
    description: "Review auth accounts, reset passwords, and audit generated suites."
  },
  {
    id: "messages",
    title: "Support inbox",
    description: "See every contact form submission with the raw message and metadata."
  },
  {
    id: "settings",
    title: "App settings",
    description: "Configure model routing and future workspace-level controls."
  }
] as const;

export function AdminTabs({
  users,
  currentUserId,
  contactMessages,
  aiProvider
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<typeof tabDefinitions[number]["id"]>("users");

  return (
    <div className="rounded-[36px] border border-black/10 bg-gradient-to-br from-white/80 via-stone-100 to-stone-200 p-1 shadow-[0_45px_90px_rgba(15,23,42,0.25)]">
      <div className="rounded-[32px] bg-white/90 p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-stone-500">Admin control</p>
            <p className="font-display text-3xl tracking-tight text-stone-900">
              Operate users and support from a single view
            </p>
          </div>
          <p className="text-sm uppercase tracking-[0.4em] text-stone-400">Single dashboard</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {tabDefinitions.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "rounded-[24px] border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  isActive
                    ? "border-slate-900 bg-slate-950 text-white shadow-[0_15px_40px_rgba(15,23,42,0.35)]"
                    : "border-stone-200 bg-white text-stone-600 hover:border-slate-300"
                )}
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id)}
              >
                <div
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-[0.4em]",
                    isActive ? "text-white/80" : "text-stone-500"
                  )}
                >
                  {tab.id === "users"
                    ? "Suite ops"
                    : tab.id === "messages"
                    ? "Inbox"
                    : "Config"}
                </div>
                <p
                  className={cn(
                    "mt-2 font-display text-xl",
                    isActive ? "text-white" : "text-stone-900"
                  )}
                >
                  {tab.title}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    isActive ? "text-white/70" : "text-stone-500"
                  )}
                >
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-4">
          {activeTab === "users" ? (
            <AdminConsole users={users} currentUserId={currentUserId} />
          ) : activeTab === "messages" ? (
            <AdminContactSubmissions messages={contactMessages} />
          ) : (
            <AdminAppSettings initialProvider={aiProvider} />
          )}
        </div>
      </div>
    </div>
  );
}
