"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ContactForm() {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("reason") || "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(
    reason === "disabled" ? "My account has been disabled" : ""
  );
  const [message, setMessage] = useState(
    reason === "disabled"
      ? "My account was disabled and I need help restoring access."
      : ""
  );
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFeedback("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          reason
        })
      });

      const payload = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        setError(payload.error || "Unable to send your message right now.");
        return;
      }

      setFeedback(payload.message || "Message sent successfully.");
      setName("");
      setEmail("");
      setSubject(reason === "disabled" ? "My account has been disabled" : "");
      setMessage(
        reason === "disabled"
          ? "My account was disabled and I need help restoring access."
          : ""
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel mx-auto w-full max-w-2xl p-6 sm:p-8">
      <div className="space-y-3">
        <span className="eyebrow">Contact support</span>
        <h1 className="font-display text-4xl tracking-tight">Reach the admin team</h1>
        <p className="text-sm leading-7 text-stone-600">
          Use this form to reach the admin. Every submission is stored in Supabase so the
          admin team can review it even if you lose your inbox or switch email providers.
        </p>
      </div>

      {reason === "disabled" ? (
        <div className="mt-6 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-700">
          Your account is disabled by an admin. Please contact the admin team to request
          access restoration.
        </div>
      ) : null}

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-800" htmlFor="contact-name">
              Full name
            </label>
            <Input
              id="contact-name"
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-800" htmlFor="contact-email">
              Email address
            </label>
            <Input
              id="contact-email"
              autoComplete="email"
              placeholder="jane@company.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-800" htmlFor="contact-subject">
            Subject
          </label>
          <Input
            id="contact-subject"
            placeholder="How can we help?"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-stone-800" htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            className="flex min-h-40 w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-stone-400 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            placeholder="Describe the issue, affected account, and what you need from the admin."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </div>

        <Button className="w-full sm:w-auto" variant="accent" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {feedback ? <p className="mt-4 text-sm text-emerald-700">{feedback}</p> : null}
    </div>
  );
}
