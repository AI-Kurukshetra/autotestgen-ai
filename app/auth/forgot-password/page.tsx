import { PasswordResetRequestForm } from "@/components/password-reset-request-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center px-4 py-8 lg:px-10">
      <PasswordResetRequestForm />
    </main>
  );
}
