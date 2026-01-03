import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@styles/globals.scss";
import { Fira_Sans } from 'next/font/google';
import Header from "@components/Header";
import Footer from "@components/Footer";

const firaSans = Fira_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-fira',
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
  description: "Це молодіжний медіа-проект із напрацювань аматорського медіа-контенту та культурно-мистецьких заходів децентралізованою групою виробників - молоді, яка пов’язана із основними партнерськими громадськими організаціями, що отримують фінансування на заходи від головного донора - програми Ерасмус +.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <html lang="en" className={`${firaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-indigo-50">
        <div className="container grid grid-cols-6">
          <div className="col-span-6">
            <Header/>
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
