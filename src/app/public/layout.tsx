import type { Metadata } from "next";
import "@styles/globals.scss";

import Header from "@/app/public/components/Header";
import Footer from "@/app/public/components/Footer";
import ArrowToTop from "./components/ArrowToTop";

import { BackgroundProvider } from "./providers/BackgroundProvider";
import BackgroundShell from "@/app/public/components/BackgroundShell";
import MainShell from "@components/MainShell";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackgroundProvider>
      <BackgroundShell>
        <Header />
        <MainShell>{children}</MainShell>
        <div className="container">
          <ArrowToTop />
          <Footer />
        </div>
      </BackgroundShell>
    </BackgroundProvider>
  );
}