"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type BgKey = "none" | "alt" | "dark" | "default";

type BackgroundContextValue = {
  bg: BgKey;
  setBg: (bg: BgKey) => void;
};

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [bg, setBg] = useState<BgKey>("none");

  const value = useMemo(() => ({ bg, setBg }), [bg]);

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
}
