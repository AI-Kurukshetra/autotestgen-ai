"use client";

import Link from "next/link";
import { Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  email?: string;
  isAdmin?: boolean;
};

export function MobileNav({ email, isAdmin = false }: MobileNavProps) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isAuthenticated = Boolean(email);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
    <div className="relative z-40 md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((current) => !current)}
        className="relative z-[70] flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/80 text-stone-900 transition hover:bg-white"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-[72px] z-[60]">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-stone-950/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="absolute inset-x-4 top-0 max-h-[calc(100vh-88px)] overflow-y-auto rounded-[28px] border border-black/10 bg-background/95 p-4 shadow-panel">
            <div className="space-y-4">
              {isAuthenticated ? (
                <div className="rounded-[24px] bg-stone-950 px-4 py-4 text-white">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-400">
                    Signed in
                  </p>
                  <p className="mt-2 break-all text-sm font-medium">{email}</p>
                </div>
              ) : null}

              <div className="grid gap-2">
                <Link
                  href="/dashboard"
                  className={cn(buttonVariants({ variant: "ghost", size: "default" }), "justify-start rounded-2xl")}
                >
                  Dashboard
                </Link>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    className={cn(buttonVariants({ variant: "ghost", size: "default" }), "justify-start rounded-2xl")}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                ) : null}

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/settings"
                      className={cn(buttonVariants({ variant: "outline", size: "default" }), "justify-start rounded-2xl")}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isPending}
                      className={cn(
                        buttonVariants({ variant: "accent", size: "default" }),
                        "justify-start rounded-2xl"
                      )}
                    >
                      {isPending ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className={cn(buttonVariants({ variant: "outline", size: "default" }), "justify-start rounded-2xl")}
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className={cn(buttonVariants({ variant: "accent", size: "default" }), "justify-start rounded-2xl")}
                    >
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
