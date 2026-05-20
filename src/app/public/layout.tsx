import type { Metadata } from "next";
import "@styles/globals.scss";
import { Geist, Geist_Mono } from "next/font/google";
import { Fira_Sans } from "next/font/google";

import Header from "@/app/public/components/Header";
import Footer from "@/app/public/components/Footer";
import ArrowToTop from "./components/ArrowToTop";

import { BackgroundProvider } from "./providers/BackgroundProvider";
import BackgroundShell from "@/app/public/components/BackgroundShell";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${firaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased border-box">
        <BackgroundProvider>
          <BackgroundShell>
            {/* fixed header shell */}
            <div className="fixed top-0 left-0 right-0 z-[1200]">
              <div className="container px-6 lg:px-0">
                <Header />
              </div>
            </div>
            <div className="container grid grid-cols-6">
              <div className="col-span-6">
                <div className="lg:pt-16">
                  <main className="pt-16 lg:pt-20">
                    {children}
                  </main>
                </div>
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