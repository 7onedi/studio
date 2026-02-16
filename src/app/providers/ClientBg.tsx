"use client";
import PageBackground from "../components/PageBackground";

export default function ClientBg(bg: { bg: "none" | "alt" | "dark" | "default" }) {
  return <PageBackground bg={bg.bg} />;
}
