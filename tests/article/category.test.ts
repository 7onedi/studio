import path from "path";
import fs from "fs";

// === Налаштування ===
const BASE_URL = "http://localhost:3000";
const LOGIN_EMAIL = "test@gmail.com";
const LOGIN_PASSWORD = "111111";

async function getToken() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD }),
  });

  const data = await res.json();

  if (res.headers.get("set-cookie")) {
    const cookie = res.headers.get("set-cookie")!;
    return cookie.split(";")[0].split("=")[1];
  }

  if (data.token) return data.token;

  throw new Error("Не вдалося отримати токен");
}

async function run() {
  const token = await getToken();
  console.log("Token:", token);

  const headers = {
    "Content-Type": "application/json",
    Cookie: `token=${token}`,
  };


    const userId = 2; // тестовий користувач