"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { getAuthErrorMessage } from "@/lib/auth-error-message";
import { getDashboardUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabaseClient";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") || "/dashboard";
  const queryMessage = searchParams?.get("message") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLoading = isSubmitting || isPending;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setError(getAuthErrorMessage(signInError.message));
          return;
        }

        startTransition(() => {
          router.push(next);
          router.refresh();
        });
        return;
      }

      const existingEmailResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const existingEmailPayload = (await existingEmailResponse.json()) as {
        exists?: boolean;
        error?: string;
      };

      if (!existingEmailResponse.ok) {
        setError(existingEmailPayload.error || "Unable to verify this email right now.");
        return;
      }

      if (existingEmailPayload.exists) {
        setError("An account with this email already exists. Please log in instead.");
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getDashboardUrl()
        }
      });

      if (signUpError) {
        setError(getAuthErrorMessage(signUpError.message));
        return;
      }

      if (data.session) {
        startTransition(() => {
          router.push(next);
          router.refresh();
        });
        return;
      }

      setMessage("Account created. Check your email to confirm your sign-up.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const heading = mode === "login" ? "Return to the lab" : "Create your workspace";
  const cta = mode === "login" ? "Login" : "Sign up";

  return (
    <div className="panel mx-auto w-full max-w-md p-8">
      <div className="space-y-3">
        <span className="eyebrow">{mode === "login" ? "Secure login" : "New account"}</span>
        <h1 className="font-display text-4xl tracking-tight">{heading}</h1>
        <p className="text-sm text-stone-600">
          {mode === "login"
            ? "Access saved scans, generated suites, and your test history."
            : "Create a Supabase-authenticated account to start generating test suites."}
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
        <PasswordInput
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          placeholder="Minimum 6 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {mode === "login" ? (
          <div className="flex justify-end">
            <Link
              className="text-sm font-medium text-stone-700 underline decoration-primary/50 underline-offset-4 transition hover:text-stone-950"
              href="/auth/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        ) : null}
        <Button className="w-full" variant="accent" size="lg" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? (
            <>
              <span
                aria-hidden="true"
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/35 border-t-primary-foreground"
              />
              <span className="sr-only">{mode === "login" ? "Logging in" : "Signing up"}</span>
            </>
          ) : (
            cta
          )}
        </Button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message || queryMessage ? (
        <p className="mt-4 text-sm text-emerald-700">{message || queryMessage}</p>
      ) : null}

      <p className="mt-6 text-sm text-stone-600">
        {mode === "login" ? "Need an account?" : "Already registered?"}{" "}
        <Link
          className="font-semibold text-stone-950 underline decoration-primary/50 underline-offset-4"
          href={mode === "login" ? "/auth/signup" : "/auth/login"}
        >
          {mode === "login" ? "Sign up" : "Login"}
        </Link>
      </p>
    </div>
  );
}
