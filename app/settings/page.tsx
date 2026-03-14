import { BadgeCheck, CalendarClock, Mail } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { count } = await supabase
    .from("test_generations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const accountDetails = [
    {
      icon: Mail,
      label: "Email address",
      value: user.email || "Not available"
    },
    {
      icon: CalendarClock,
      label: "Last sign in",
      value: user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Not available"
    }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="space-y-6">
          <div className="panel p-6">
            <span className="eyebrow">Settings</span>
            <h1 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
              Account details
            </h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Review the authentication details currently attached to your AutoTestGen AI
              workspace.
            </p>
          </div>

          <div className="panel overflow-hidden p-0">
            <div className="bg-stone-950 px-6 py-6 text-white">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                Primary identity
              </p>
              <p className="mt-3 break-all font-display text-2xl sm:text-3xl">{user.email}</p>
            </div>
            <div className="grid gap-px bg-black/10 sm:grid-cols-2">
              <div className="bg-white px-6 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  Email confirmed
                </p>
                <p className="mt-2 text-sm font-medium text-stone-900">
                  {user.email_confirmed_at ? formatDate(user.email_confirmed_at) : "Pending"}
                </p>
              </div>
              <div className="bg-white px-6 py-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  Joined
                </p>
                <p className="mt-2 text-sm font-medium text-stone-900">
                  {user.created_at ? formatDate(user.created_at) : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="metric-card">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                Generated suites
              </p>
              <p className="mt-3 font-display text-5xl">{count ?? 0}</p>
            </div>
            <div className="panel p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-2xl">Account status</p>
                  <p className="mt-1 text-sm text-stone-600">
                    {user.email_confirmed_at ? "Verified and active" : "Awaiting verification"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="space-y-2">
              <span className="eyebrow">Profile snapshot</span>
              <h2 className="font-display text-3xl tracking-tight">Current user data</h2>
            </div>

            <div className="mt-6 space-y-3">
              {accountDetails.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div
                    key={detail.label}
                    className="rounded-[24px] border border-black/10 bg-white/70 px-5 py-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
                          {detail.label}
                        </p>
                        <p className="mt-2 break-all text-sm font-medium text-stone-900">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
