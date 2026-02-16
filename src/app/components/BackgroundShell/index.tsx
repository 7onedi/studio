"use client";

import { useBackground } from "@/app/providers/BackgroundProvider";

export default function BackgroundShell({ children }: { children: React.ReactNode }) {
  const { bg } = useBackground();

  return <div className={`min-h-screen page-bg page-bg--${bg}`}>{children}</div>;
}
