import type { Metadata } from "next";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import { Geist, Geist_Mono, Fira_Sans, Maven_Pro } from "next/font/google";

const firaSans = Fira_Sans({
  weight: ["400", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-fira",
  display: "swap",
  preload: true,
});

const mavenPro = Maven_Pro({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-maven",
  display: "swap",
  preload: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}