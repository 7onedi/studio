"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import AuthLogin from "../../../authentication/auth/AuthLogin";
import { sessionManager } from "@/lib/sessionManager";

export default function SessionExpiredDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    sessionManager.onOpen(() => setOpen(true));
    sessionManager.onClose(() => setOpen(false));
  }, []);

  const handleRelogin = async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (!res.ok) {
      if (result.errors) throw { errors: result.errors };
      throw { message: result.message || "Login failed" };
    }
    sessionManager.resolveAll();
  };

  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle>Сесія завершилась — увійдіть знову, щоб продовжити</DialogTitle>
      <DialogContent>
        <AuthLogin onSubmit={handleRelogin} />
      </DialogContent>
    </Dialog>
  );
}