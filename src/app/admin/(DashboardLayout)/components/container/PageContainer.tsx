// import { Helmet } from 'react-helmet';
import react from 'react'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

const PageContainer = ({ children, title, description }: Props) => {
  const router = useRouter();
  const isAdminPage = window.location.pathname.startsWith("/admin") &&
                    !window.location.pathname.startsWith("/admin/authentication");
  useEffect(() => {
    if (!isAdminPage) return;
    fetch('/api/middleware/adminCheck', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        console.log("[PageContainer] AdminCheck response:", res.status, data);

        if (res.status === 401) {
          router.push('/admin/authentication/login'); // Не авторизований
        } else if (res.status === 403) {
          router.push('/'); // USER → редірект на /
        }
        // 200 → ADMIN/EDITOR → все ок
      })
      .catch(() => {
        router.push('/');
      });
  }, [router]);

  return (
    <div>
      <title>{title}</title>
      <meta name="description" content={description} />
      {children}
    </div>
  );
};

export default PageContainer;
