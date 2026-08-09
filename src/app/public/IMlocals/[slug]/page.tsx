import Image from "next/image";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import MfkList from "@/app/public/blocks/MfkList";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { getParentProject } from '@lib/getProjects';
import { getProjectMarkers } from '@lib/getProjectMarkers';
import { MfkTranslatedBody, MfkTranslatedTitle } from '../../Mfk/[slug]/MfkTranslated';
import TranslatedText from "@components/TranslatedText";
import LocationMap from "@components/LocationMapLoader";

interface IMlocalsPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function IMlocalsPage({ params }: IMlocalsPageProps) {
  const { slug } = await params;

  const result = await getParentProject('Imagemapping');
  const children = result?.children ?? [];

  const child = children.find((p: any) => p.subcategory?.slug === slug);

  if (!child) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Локацію не знайдено
      </div>
    );
  }

  const rawMarkers = await getProjectMarkers(child.id);

  const mapMarkers = rawMarkers
  .filter((m) => m.location?.coordinates)
  .map((m) => {
    const coords = m.location!.coordinates as { lat: number; lng: number };
    return {
      id: m.id,
      title: m.title,
      title_en: m.title_en,
      title_pl: m.title_pl,
      title_lt: m.title_lt,
      title_ro: m.title_ro,
      body: (m.body as any)?.blocks ?? [],
      body_en: (m.body_en as any)?.blocks ?? [],
      body_pl: (m.body_pl as any)?.blocks ?? [],
      body_lt: (m.body_lt as any)?.blocks ?? [],
      body_ro: (m.body_ro as any)?.blocks ?? [],
      markerType: m.markerType ?? 'IMAGEMAPPING',
      imageUrl: m.image?.url,
      websiteUrl: m.location?.url ?? null,
      lat: coords.lat,
      lng: coords.lng,
    };
  });

  const centerLat = child.location?.coordinates?.lat ?? 49.23;
  const centerLng = child.location?.coordinates?.lng ?? 28.47;

  const otherMarkers = children
    .filter((p: any) => p.subcategory?.slug !== slug)
    .map((p: any) => ({
      popupContent: {
        slug:  p.subcategory?.slug ?? String(p.id),
        title: p.title,
        title_en: p.title_en,
        title_pl: p.title_pl,
        title_lt: p.title_lt,
        title_ro: p.title_ro,
        Logo:  p.logo?.url ?? p.image?.url ?? '',
        zoom:  false,
        lang:  p.lang ?? 'uk',
      },
    }));

  const socialLinks = child.socialLinks ?? [];

  return (
    <div className="mx-auto mt-4 lg:mt-0">
      {/* ...весь наявний блок з Image/лого/заголовком/соцмережами без змін... */}

      {/* Опис */}
      {child.body?.blocks?.length > 0 && (
        <div className="relative space-y-6 rounded-2xl bg-indigo-50 p-6 text-main-text leading-relaxed border-b-2 border-main-amarant">
          <div className="mt-6 flex justify-center">
            <p className="lg:mb-4 text-headline_4_mobile lg:text-headline_4">
              <TranslatedText tKey="pages.club_preview_block.aboutPlaces" />
            </p>
          </div>
          <MfkTranslatedBody child={child} />
        </div>
      )}

      {/* Карта з маркерами 3-го ряду */}
      {mapMarkers.length > 0 && (
        <div className="my-8">
          <LocationMap
            centerLat={centerLat}
            centerLng={centerLng}
            zoom={14}
            markers={mapMarkers}
          />
        </div>
      )}

      <div className="my-8">
        <BlogSlider
          categoryId={String(child.categoryId)}
          subcategoryId={String(child.subcategoryId)}
        />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherMarkers} id="#implaces" />
      </div>
    </div>
  );
}