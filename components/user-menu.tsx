"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, UserCircle2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabaseClient";

type UserMenuProps = {
  email: string;
};

export function UserMenu({ email }: UserMenuProps) {
  const supabase = createClient();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const initials = email.slice(0, 1).toUpperCase();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleLogout() {
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    startTransition(() => {
      setOpen(false);
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-left transition hover:bg-white"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-medium text-stone-900">{email}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500">
            Account
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-stone-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+12px)] z-40 w-72 rounded-[24px] border border-black/10 bg-white p-3 shadow-panel">
          <div className="rounded-[20px] bg-stone-950 px-4 py-4 text-white">
            <div className="flex items-start gap-3">
              <UserCircle2 className="mt-0.5 h-5 w-5 text-primary" />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400">
                  Signed in as
                </p>
                <p className="mt-2 break-all text-sm font-medium text-white">{email}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "Logging out..." : "Logout"}
            </button>
          </div>

          {error ? <p className="px-3 pt-2 text-xs text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
