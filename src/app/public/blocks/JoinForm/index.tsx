"use client";

import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import { Button } from "@/app/public/components/Button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useState } from "react";

interface JoinFormProps {
  title?: RichTextItem[];
  description?: RichTextItem[];
}

type Role = "MEMBER" | "DONOR" | "PARTNER";

export default function JoinForm({ title = [], description = [] }: JoinFormProps) {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const roleValues: { label: string; value: Role }[] = [
    { label: t("join.membership_types.member"), value: "MEMBER" },
    { label: t("join.membership_types.donor"),  value: "DONOR" },
    { label: t("join.membership_types.partner"), value: "PARTNER" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setStatus("success");
      setName("");
      setEmail("");
      setRole("");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message ?? "Unknown error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-4 lg:py-8 lg:px-32 text-center rounded-2xl border border-main-amarant bg-white shadow-lg"
    >
      <h2 className="mb-6 text-headline_4_mobile lg:text-headline_4 font-semibold text-main-text">
        {renderRichText(title)}
      </h2>

      <p className="mb-4 text-subtitle_1_mobile lg:text-subtitle_1 leading-relaxed text-main-text/80">
        {renderRichText(description)}
      </p>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder={t("join.name_placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border-b border-main-grey bg-transparent py-2 text-sm outline-none"
        />

        <input
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-b border-main-grey bg-transparent py-2 text-sm outline-none"
        />
      </div>

      <div className="mb-6 text-body text-left text-main-text">
        <p className="mb-3">{t("join.member_type_description")}</p>

        <div className="space-y-2">
          {roleValues.map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                required
                className="w-6 h-6 my-1"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {status === "success" && (
        <p className="mb-4 text-sm text-green-600">{t("join.success_message")}</p>
      )}

      {status === "error" && (
        <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <div className="mt-12 mb-2 flex flex-cols justify-center items-center">
        <Image
          src="/svg/Double_LeftArrow.svg"
          alt="Left Arrow"
          width={95}
          height={80}
          className="lg:mr-4 w-[74px] h-[60px] lg:w-[95px] lg:h-[80px]"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={status === "loading"}
          className="!text-button_mobile lg:!text-button"
        >
          {status === "loading" ? "..." : t("join.join_us")}
        </Button>
        <Image
          src="/svg/Double_RightArrow.svg"
          alt="Right Arrow"
          width={95}
          height={80}
          className="lg:ml-4 w-[74px] h-[60px] lg:w-[95px] lg:h-[80px]"
        />
      </div>
    </form>
  );
}