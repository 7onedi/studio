"use client";

import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import { Button } from "@/app/public/components/Button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

interface JoinFormProps {
  title?: RichTextItem[];
  description?: RichTextItem[];
}

type Role = "MEMBER" | "DONOR" | "PARTNER";

export default function JoinForm({ title = [], description = [] }: JoinFormProps) {
  const { t } = useLanguage();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; role?: string }>({});


  const roleValues: { label: string; value: Role }[] = [
    { label: t("join.membership_types.member"), value: "MEMBER" },
    { label: t("join.membership_types.donor"),  value: "DONOR" },
    { label: t("join.membership_types.partner"), value: "PARTNER" },
  ];

  function validate(): boolean {
    if (!turnstileToken) {
      setErrorMessage(t("join.validation.captcha_required"));
      return false;
    }
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = t("join.validation.name_required");
    if (!email.trim()) newErrors.email = t("join.validation.email_required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t("join.validation.email_invalid");
    if (!role) newErrors.role = t("join.validation.role_required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), role, turnstileToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // обробка відомих помилок
        if (res.status === 409 || data?.message?.includes("email")) {
          setErrors({ email: t("join.validation.email_taken") });
          setStatus("idle");
          return;
        }
        throw new Error(t("join.validation.server_error"));
      }

      setStatus("success");
      setName("");
      setEmail("");
      setRole("");
      setErrors({});
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message ?? t("join.validation.server_error"));
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
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
          className={`w-full border-b bg-transparent py-2 text-sm outline-none ${
            errors.name ? "border-red-400" : "border-main-grey"
          }`}
        />
        {errors.name && <p className="text-xs text-red-400 text-left mt-1">{errors.name}</p>}

        <input
          type="email"
          placeholder="email@gmail.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
          className={`w-full border-b bg-transparent py-2 text-sm outline-none ${
            errors.email ? "border-red-400" : "border-main-grey"
          }`}
        />
        {errors.email && <p className="text-xs text-red-400 text-left mt-1">{errors.email}</p>}
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
              {errors.role && <p className="text-xs text-red-400 mt-1">{errors.role}</p>}
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

      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setTurnstileToken}
        onError={() => setTurnstileToken(null)}
      />
      
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