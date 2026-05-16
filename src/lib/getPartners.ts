export interface PartnerItem {
  id: number;
  name: string;
  description?: string | null;
  image?: { id: number; url: string } | null;
  published: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'MEMBER' | 'DONOR' | 'PARTNER';
}

export async function getPartners(role: 'PARTNER' | 'DONOR' | 'MEMBER'): Promise<PartnerItem[]> {
  const BASE_URL = process.env.API_URL ?? 'http://localhost:3000';

  const res = await fetch(
    `${BASE_URL}/api/partners/search?role=${role}&published=true&status=APPROVED&limit=100&page=1`,
    { next: { revalidate: 60 } }
  );

  const data = await res.json().catch(() => null);
  return Array.isArray(data?.data) ? data.data : [];
}