import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center px-4 py-8 lg:px-10">
      <AuthForm mode="login" />
    </main>
  );
}
