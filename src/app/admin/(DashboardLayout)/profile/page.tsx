import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProfileIndexPage() {
  // Тягнемо поточного юзера на сервері через ту саму куку
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  const res = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) {
    // Не авторизований — на логін
    redirect("/admin/authentication/login");
  }

  const user = await res.json();

  redirect(`/admin/profile/${user.id}`);
}