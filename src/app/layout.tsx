import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const BUILD_TAG = "mk-8315";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "PTIT Found", template: "%s | PTIT Found" },
  description: "Tìm đồ thất lạc trong trường PTIT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body data-build-tag={BUILD_TAG}>
        <nav>
          <Link href="/">Trang chủ</Link>{" · "}
          <Link href="/posts">Tin đăng</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
