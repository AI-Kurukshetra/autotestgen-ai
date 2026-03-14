import Link from "next/link";
import { Sparkles, Waypoints } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

export async function Navbar() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-950 text-white">
            <Waypoints className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl leading-none tracking-tight">AutoTestGen AI</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">
              Web QA in minutes
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Dashboard
          </Link>
          {user ? (
            <UserMenu email={user.email || "Unknown user"} />
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
      </div>
    </header>
  );
}
