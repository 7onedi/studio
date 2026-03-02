// import { Helmet } from 'react-helmet';
"use client";
import react from 'react'

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

const PageContainer = ({ children, title, description }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAdminPage =
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/authentication");

    if (!isAdminPage) return;

    fetch("/api/middleware/adminCheck", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/admin/authentication/login");
        } else if (res.status === 403) {
          router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, [pathname, router]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </>
  );
};

export default PageContainer;