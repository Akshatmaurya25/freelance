import type { Metadata } from "next";
import Link from "next/link";
import { Chakra_Petch, Inter } from "next/font/google";
import { CAFE } from "@/lib/stations";
import "./globals.css";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${CAFE.name} | ${CAFE.area}`,
  description:
    "PS5, PS4, gaming PCs, snooker, racing sim and VR in MP Nagar, Bhopal. Book your slot online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${chakra.variable} ${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/80 backdrop-blur">
          <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="font-display text-lg font-bold tracking-wide">
              INFINITY<span className="text-accent">∞</span>GAMING
            </Link>
            <Link
              href="/book"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110"
            >
              Book a slot
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between">
            <p>
              © {CAFE.name}, {CAFE.area}
            </p>
            <p>Open daily · 10 AM – 11 PM</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
