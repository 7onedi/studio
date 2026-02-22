// utils/auth.ts
import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const loginUser = (username: string, password: string) => {
  // Для простоти — перевірка "локальна"
  const users = JSON.parse(getCookie("users") as string || "[]");
  const user = users.find((u: any) => u.username === username && u.password === password);
  if (user) {
    setCookie("admin_token", user.username, { maxAge: 60 * 60 * 24 }); // 1 день
    return true;
  }
  return false;
};

export const registerUser = (username: string, password: string) => {
  const users = JSON.parse(getCookie("users") as string || "[]");
  if (users.find((u: any) => u.username === username)) return false; // вже є
  users.push({ username, password });
  setCookie("users", JSON.stringify(users), { maxAge: 60 * 60 * 24 * 365 });
  return true;
};

export const logoutUser = () => {
  deleteCookie("admin_token");
};

export const isLoggedIn = () => !!getCookie("admin_token");