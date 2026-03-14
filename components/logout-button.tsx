"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    setError("");
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    startTransition(() => {
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleLogout} size="sm" variant="outline" disabled={isPending}>
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
