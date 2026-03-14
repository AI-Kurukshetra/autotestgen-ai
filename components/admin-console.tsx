"use client";

import {
  Ban,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { AdminUserView } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type AdminConsoleProps = {
  users: AdminUserView[];
};

type ActionState = {
  target: string;
  kind: "disable" | "reset" | "";
};

function isUserDisabled(bannedUntil?: string) {
  return Boolean(bannedUntil && new Date(bannedUntil).getTime() > Date.now());
}

export function AdminConsole({ users }: AdminConsoleProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [actionState, setActionState] = useState<ActionState>({
    target: "",
    kind: ""
  });
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const metrics = useMemo(
    () => ({
      totalUsers: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      disabled: users.filter((user) => isUserDisabled(user.banned_until)).length,
      suites: users.reduce((total, user) => total + user.suite_count, 0)
    }),
    [users]
  );

  async function runAction(
    userId: string,
    kind: "disable" | "reset",
    body?: Record<string, unknown>
  ) {
    setFeedback((current) => ({ ...current, [userId]: "" }));
    setActionState({ target: userId, kind });

    const endpoint =
      kind === "disable"
        ? `/api/admin/users/${userId}/status`
        : `/api/admin/users/${userId}/reset`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const result = (await response.json()) as { error?: string; message?: string };

    if (!response.ok) {
      setFeedback((current) => ({
        ...current,
        [userId]: result.error || "Admin action failed."
      }));
      setActionState({ target: "", kind: "" });
      return;
    }

    setFeedback((current) => ({
      ...current,
      [userId]: result.message || "Action completed."
    }));
    setActionState({ target: "", kind: "" });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="metric-card">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
            Users
          </p>
          <p className="mt-3 font-display text-5xl">{metrics.totalUsers}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
            Admins
          </p>
          <p className="mt-3 font-display text-5xl">{metrics.admins}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
            Disabled
          </p>
          <p className="mt-3 font-display text-5xl">{metrics.disabled}</p>
        </div>
        <div className="panel p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
            Suites
          </p>
          <p className="mt-3 font-display text-5xl">{metrics.suites}</p>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => {
          const disabled = isUserDisabled(user.banned_until);
          const isBusy = actionState.target === user.id;

          return (
            <div key={user.id} className="panel p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="break-all font-display text-3xl tracking-tight">
                      {user.email}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] ${
                        user.role === "admin"
                          ? "bg-stone-950 text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] ${
                        disabled
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {disabled ? "disabled" : "active"}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[20px] border border-black/10 bg-white/70 px-4 py-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                        Joined
                      </p>
                      <p className="mt-2 text-sm font-medium text-stone-900">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                    <div className="rounded-[20px] border border-black/10 bg-white/70 px-4 py-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                        Last sign in
                      </p>
                      <p className="mt-2 text-sm font-medium text-stone-900">
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Never"}
                      </p>
                    </div>
                    <div className="rounded-[20px] border border-black/10 bg-white/70 px-4 py-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                        Generated suites
                      </p>
                      <p className="mt-2 text-sm font-medium text-stone-900">
                        {user.suite_count}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isBusy}
                    onClick={() =>
                      runAction(user.id, "reset", {
                        email: user.email
                      })
                    }
                  >
                    {isBusy && actionState.kind === "reset" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <KeyRound className="h-4 w-4" />
                    )}
                    Send reset email
                  </Button>
                  <Button
                    variant={disabled ? "default" : "outline"}
                    size="sm"
                    disabled={isBusy || user.role === "admin"}
                    onClick={() =>
                      runAction(user.id, "disable", {
                        disabled: !disabled
                      })
                    }
                  >
                    {isBusy && actionState.kind === "disable" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : disabled ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                    {disabled ? "Enable user" : "Disable user"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setExpanded((current) => ({
                        ...current,
                        [user.id]: !current[user.id]
                      }))
                    }
                  >
                    {expanded[user.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Suites
                  </Button>
                </div>
              </div>

              {feedback[user.id] ? (
                <p className="mt-4 text-sm text-stone-600">{feedback[user.id]}</p>
              ) : null}

              {expanded[user.id] ? (
                <div className="mt-6 space-y-3 border-t border-black/10 pt-6">
                  {user.suites.length > 0 ? (
                    user.suites.map((suite) => (
                      <div
                        key={suite.id}
                        className="rounded-[24px] border border-black/10 bg-white/70 px-5 py-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-stone-900">
                              {suite.url}
                            </p>
                            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                              {suite.framework} · {suite.language}
                            </p>
                          </div>
                          <p className="text-xs text-stone-500">
                            {formatDate(suite.created_at)}
                          </p>
                        </div>
                        <pre className="mt-4 overflow-x-auto rounded-2xl bg-stone-950 p-4 font-mono text-xs leading-6 text-stone-200">
                          {suite.generated_code.slice(0, 500)}
                          {suite.generated_code.length > 500 ? "\n..." : ""}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-black/15 bg-white/60 p-5 text-sm text-stone-500">
                      No generated suites for this user.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
