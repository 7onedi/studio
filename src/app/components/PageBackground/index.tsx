"use client";

import { useEffect } from "react";
import { useBackground } from "@/app/providers/BackgroundProvider";

export default function PageBackground({
  bg,
  resetOnUnmount = true,
}: {
  bg: "none" | "alt" | "dark" | "default";
  resetOnUnmount?: boolean;
}) {
  const { setBg } = useBackground();

  useEffect(() => {
    setBg(bg);

    return () => {
      if (resetOnUnmount) setBg("none");
    };
  }, [bg, resetOnUnmount, setBg]);

  return null;
}
