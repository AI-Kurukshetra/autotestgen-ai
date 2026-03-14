import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-10">
      <ContactForm />
    </main>
  );
}
