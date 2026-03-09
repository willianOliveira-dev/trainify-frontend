import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

import { AiChatbot } from "@/components/ai-chatbot";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${interTight.variable} antialiased`}
      >
        <NuqsAdapter>
          {children}
          <AiChatbot />
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
