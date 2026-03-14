"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabaseClient";

export function PasswordUpdateForm() {
  const supabase = createClient();
  const router = useRouter();
  const id = useId();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function checkSession() {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!ignore) {
        setHasRecoverySession(Boolean(user));
        setCheckingSession(false);
      }
    }

    void checkSession();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setMessage("Password updated. Redirecting to login...");
      router.push(
        "/auth/login?message=Password%20updated.%20You%20can%20sign%20in%20with%20your%20new%20password."
      );
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel mx-auto w-full max-w-md p-8">
      <div className="space-y-3">
        <span className="eyebrow">Set a new password</span>
        <h1 className="font-display text-4xl tracking-tight">Choose a new password</h1>
        <p className="text-sm text-stone-600">
          Complete recovery by replacing the old password on your account.
        </p>
      </div>

      {checkingSession ? (
        <p className="mt-8 text-sm text-stone-600">Checking recovery session...</p>
      ) : !hasRecoverySession ? (
        <div className="mt-8 rounded-3xl border border-black/10 bg-white/70 p-5">
          <p className="text-sm text-stone-600">
            This recovery link is missing or expired. Request a fresh reset email to
            continue.
          </p>
          <Link
            className="mt-4 inline-flex text-sm font-semibold text-stone-950 underline decoration-primary/50 underline-offset-4"
            href="/auth/forgot-password"
          >
            Request a new reset link
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-stone-800"
              htmlFor={`${id}-password`}
            >
              New password
            </label>
            <PasswordInput
              id={`${id}-password`}
              autoComplete="new-password"
              minLength={6}
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-stone-800"
              htmlFor={`${id}-confirm-password`}
            >
              Confirm new password
            </label>
            <PasswordInput
              id={`${id}-confirm-password`}
              autoComplete="new-password"
              minLength={6}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          <Button className="w-full" variant="accent" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
    </div>
  );
}
