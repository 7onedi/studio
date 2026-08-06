import type { Metadata } from "next";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import localFont from "next/font/local";

const firaSans = localFont({
  src: [
    { path: "../fonts/fira-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/fira-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-fira",
  display: "swap",
  preload: true,
});

const mavenPro = localFont({
  src: [
    { path: "../fonts/maven-pro-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/maven-pro-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/maven-pro-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-maven",
  display: "swap",
  preload: true,
});

const geistSans = localFont({
  src: [
    { path: "../fonts/geist-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/geist-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

const geistMono = localFont({
  src: [
    { path: "../fonts/geist-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/geist-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Міжкультурна Молодіжна Студія",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uk"
      className={`${firaSans.variable} ${mavenPro.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}