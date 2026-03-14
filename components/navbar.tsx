import Link from "next/link";
import { ShieldCheck, Sparkles, Waypoints } from "lucide-react";

import { MobileNav } from "@/components/mobile-nav";
import { getCurrentUserRole } from "@/lib/supabase/admin";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const { user, role } = await getCurrentUserRole();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <Link className="min-w-0 flex items-center gap-3" href="/">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white sm:h-11 sm:w-11">
            <Waypoints className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-none tracking-tight sm:text-xl">
              AutoTestGen AI
            </p>
            <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500 sm:block">
              Web QA in minutes
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Dashboard
          </Link>
          {user && role === "admin" ? (
            <Link
              href="/admin"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
          {user ? (
            <UserMenu email={user.email || "Unknown user"} isAdmin={role === "admin"} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
              >
                <Sparkles className="h-4 w-4" />
                Get Started
              </Link>
            </>
          )}
        </nav>

        <MobileNav email={user?.email} isAdmin={role === "admin"} />
      </div>
    </header>
  );
}
