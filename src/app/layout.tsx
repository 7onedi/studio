import type { Metadata } from "next";
import { LanguageProvider } from "@/app/providers/LanguageProvider";

export const metadata: Metadata = {
  title: "Міжкультурна Молодіжна Студія",
  description: "...",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}