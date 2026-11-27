const BUILD_TAG = "mk-8315";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Providers from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PTIT Found",
    template: "%s | PTIT Found",
  },
  description: "Tìm đồ thất lạc trong trường PTIT",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        data-build-tag={BUILD_TAG}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}