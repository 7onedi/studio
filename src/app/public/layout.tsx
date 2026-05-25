import type { Metadata } from "next";
import "@styles/globals.scss";
import { Geist, Geist_Mono } from "next/font/google";
import { Fira_Sans } from "next/font/google";

import Header from "@/app/public/components/Header";
import Footer from "@/app/public/components/Footer";
import ArrowToTop from "./components/ArrowToTop";

import { BackgroundProvider } from "./providers/BackgroundProvider";
import BackgroundShell from "@/app/public/components/BackgroundShell";
import MainShell from "@components/MainShell";

const firaSans = Fira_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-fira",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${firaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased border-box">
        <BackgroundProvider>
          <BackgroundShell>
            <Header />
            <MainShell>
              {children}
            </MainShell>
            {/* footer в container */}
            <div className="container">
              <ArrowToTop />
              <Footer />
            </div>
          </BackgroundShell>
        </BackgroundProvider>
      </body>
    </html>
  );
}