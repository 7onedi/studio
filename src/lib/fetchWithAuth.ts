import { sessionManager } from "./sessionManager";
import { connectionManager } from "./connectionManager";

function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError;
}

export async function fetchWithAuth(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const url = typeof input === "string" ? input : input.toString();

  while (true) {
    try {
      const res = await fetch(input, { credentials: "include", ...init });

      if (res.status === 401 && !url.includes("/api/auth/")) {
        await sessionManager.waitForReauth();
        continue; // повторюємо запит після релогіну
      }

      connectionManager.reportOnline();
      return res;
    } catch (err) {
      if (isNetworkError(err)) {
        connectionManager.reportOffline();
        await connectionManager.waitForReconnect();
        continue; // повторюємо запит після відновлення з'єднання
      }
      throw err;
    }
  }
}