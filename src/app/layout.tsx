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
        <div className="flex min-h-screen">
          <aside className="w-54 bg-gray-100 text-white">
            <Navbar />
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
