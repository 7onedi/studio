// app/public/layout.tsx
import Header from "@components/Header";
import Footer from "@components/Footer";
import { Fira_Sans, Geist, Geist_Mono } from "next/font/google";
import '@styles/globals.scss'; // стилі публічного сайту

// Підключення шрифтів
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

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${firaSans.variable} ${geistSans.variable} ${geistMono.variable}`}>
      <div className="antialiased bg-indigo-50">
        <div className="container grid grid-cols-6">
          <div className="col-span-6">
            <Header />
            {children}
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
