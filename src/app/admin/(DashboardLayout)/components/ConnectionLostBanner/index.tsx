"use client";

import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { connectionManager } from "@/lib/connectionManager";

export default function ConnectionLostBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    connectionManager.onOffline(() => setOffline(true));
    connectionManager.onOnline(() => setOffline(false));
  }, []);

  return (
    <Snackbar open={offline} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert severity="warning" variant="filled">
        Втрачено з'єднання із сервером. Дані форми збережено локально — очікуємо відновлення...
      </Alert>
    </Snackbar>
  );
}