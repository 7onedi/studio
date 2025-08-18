import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@styles/globals.scss";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
