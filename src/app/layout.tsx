import type { Metadata } from "next";
import "@styles/globals.scss";
import { Geist, Geist_Mono } from "next/font/google";
import { Fira_Sans } from "next/font/google";

import Header from "@components/Header";
import Footer from "@components/Footer";
import ArrowToTop from "./components/ArrowToTop";

import { BackgroundProvider } from "./providers/BackgroundProvider";
import BackgroundShell from "@components/BackgroundShell";

const firaSans = Fira_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-fira",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Міжкультурна Молодіжна Студія",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${firaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased border-box">
        <BackgroundProvider>
          <BackgroundShell>
            <div className="container grid grid-cols-6">
              <div className="col-span-6">
                <Header />
                <div className="lg:pt-16">{children}</div>
                <ArrowToTop />
                <Footer />
              </div>
            </div>
          </BackgroundShell>
        </BackgroundProvider>
      </body>
    </html>
  );
}