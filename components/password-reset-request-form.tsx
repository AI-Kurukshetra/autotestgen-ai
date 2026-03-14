"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { getPasswordUpdateUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabaseClient";

export function PasswordResetRequestForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams?.get("email") || "");
  const [message, setMessage] = useState(searchParams?.get("message") || "");
  const [error, setError] = useState(searchParams?.get("error") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: getPasswordUpdateUrl()
        }
      );

      if (resetError) {
        setError(getAuthErrorMessage(resetError.message));
        return;
      }

      setMessage(
        "Reset link sent. Check your inbox and open the recovery link to set a new password."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel mx-auto w-full max-w-md p-8">
      <div className="space-y-3">
        <span className="eyebrow">Password recovery</span>
        <h1 className="font-display text-4xl tracking-tight">Reset your password</h1>
        <p className="text-sm text-stone-600">
          Enter the email tied to your account and we&apos;ll send a recovery link.
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          placeholder="team@company.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Button className="w-full" variant="accent" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}

      <p className="mt-6 text-sm text-stone-600">
        Remembered it?{" "}
        <Link
          className="font-semibold text-stone-950 underline decoration-primary/50 underline-offset-4"
          href="/auth/login"
        >
          Back to login
        </Link>
      </p>
    </div>
  );
}
