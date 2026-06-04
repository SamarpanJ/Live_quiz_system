import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Aurogurukul Quiz",
  description: "Run synchronized, timed live quizzes. Everyone sees the same clock.",
  icons: {
    icon: "/aurogurukul-logo.png",
    apple: "/aurogurukul-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="min-h-full font-sans text-[15px] leading-relaxed">{children}</body>
    </html>
  );
}
