// app/public/components/MainShell.tsx
"use client";

import { usePathname } from "next/navigation";

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/public";

  return (
    <main className={isHome ? '' : 'container pt-16 lg:pt-36 overflow-hidden'}>
      {children}
    </main>
  );
}