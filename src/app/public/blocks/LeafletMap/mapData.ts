import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { getParentProject } from '@lib/getProjects';

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface MarkerInfo {
  id: string;
  position: [number, number];
  popupContent: {
    slug?: string;
    title: string;
    description?: string | string[] | RichTextItem[];
    imageUrl: string;
    linkUrl?: string;
    Logo?: string;
    gradient?: string;
    zoom?: boolean;
    iconNames?: { title: string; link: string }[];
    reviews?: {
        name: string;
        title: string;
        text: string;
        profileImg: string;
        links?: SocialLinks;
    }[];
  }
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Шлях до зображення іконки (наприклад, '/map/Mark1.png')
  color: string; // Колір Tailwind CSS
  center: [number, number]; // [lat, lng] для центрування
  zoom: number;            // Рівень зуму для цієї категорії
  markers: MarkerInfo[];
}

// Конфігурація для стану "Показати всі" (для широкого огляду)
export const ALL_CATEGORIES_VIEW = {
    // !!! FIX: as const гарантує, що це кортеж [number, number]
    center: [49.0, 20.6] as const, 
    zoom: 5,
};

export async function buildCategories(): Promise<Category[]> {
  const icons = ['/map/Mark1.svg', '/map/Mark2.svg', '/map/Mark3.svg', '/map/Mark4.svg'];

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  const res = await fetch(`${BASE_URL}/api/categories`);
  const data = await res.json();
  const allCategories = Array.isArray(data) ? data : data.items ?? [];

  // 2. Для кожної категорії отримати батьківський проект
  const results = await Promise.all(
    allCategories.map(async (cat: any) => ({
      name: cat.name,
      data: await getParentProject(cat.name),
    }))
  );

  return results
    .map(({ name, data }, i) => {
      if (!data) return null;
      const { parent, children } = data;

      const center: [number, number] = [
        parent?.location?.coordinates?.lat ?? 49.0,
        parent?.location?.coordinates?.lng ?? 20.6,
      ];

      const markers: MarkerInfo[] = children
        .filter((c: any) => c.location?.coordinates)
        .map((c: any) => ({
          id: String(c.id),
          position: [c.location.coordinates.lat, c.location.coordinates.lng] as [number, number],
          popupContent: {
            slug: c.subcategory?.slug,
            title: c.title,
            description: c.body?.blocks ?? [],
            imageUrl: c.image?.url ?? '',
            Logo: c.logo?.url ?? '',
            linkUrl: c.location?.url,
          },
        }));

      return {
        id: name,
        name,
        icon: icons[i % icons.length],
        color: 'text-red-600',
        center,
        zoom: parent?.location?.coordinates?.zoom ?? 8,
        markers,
      } as Category;
    })
    .filter(Boolean) as Category[];
}