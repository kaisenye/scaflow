import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/shared/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScaFlow",
  description: "A modern web application built with Next.js, TypeScript, Shadcn UI, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="flex size-full">
          <aside className="flex min-w-54 overflow-hidden bg-gray-100 text-white">
            <Navbar />
          </aside>
          <main className="flex grow flex-col [contain:strict]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
