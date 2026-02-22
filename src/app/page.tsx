// app/page.tsx
import PublicLayout from "./public/layout";
import PublicHome from "./public/page"; // контент головної сторінки

export default function HomePage() {
  return (
    <PublicLayout>
      <PublicHome />
    </PublicLayout>
  );
}
