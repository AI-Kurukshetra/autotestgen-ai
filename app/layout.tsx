import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoTestGen AI",
  description: "Generate automated test suites instantly from any webpage."
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[360px] bg-grain opacity-80" />
          <div className="absolute left-[-120px] top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[-100px] top-12 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="relative z-10">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
