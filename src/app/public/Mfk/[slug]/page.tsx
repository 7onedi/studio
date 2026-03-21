import Image from "next/image";
import { initialCategories } from "@/app/public/blocks/LeafletMap/mapData";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import MfkList from "@/app/public/blocks/MfkList";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import { slides } from "../../blocks/ArticleSlider/slideContent";
import { getCategoryId } from '@lib/getCategoryId';

interface MfkPageProps {
  params: Promise<{
    slug?: string;
    description?: RichTextItem[];
  }>;
}

const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;
export const dynamic = 'force-dynamic';
export default async function MfkPage({ params }: MfkPageProps) {
  const categoryId = await getCategoryId('CountrysideStudio');
  const { slug } = await params;

  // знаходимо маркер по slug
  let mfk;
  for (const category of initialCategories) {
    const found = category.markers.find(
      (marker) => marker.popupContent.slug === slug
    );
    if (found) {
      mfk = found.popupContent;
      break;
    }
  }

  if (!mfk) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        MFK не знайдено
      </div>
    );
  }

  const otherMfkMarkers = mfkCategory.markers.filter(
    (marker) => marker.popupContent.slug !== slug
  );

const yfcSlides = slug
  ? slides.filter(s => s.meta.SubCategory === slug)
  : [];

  return (
    <div className="mx-auto mt-4 lg:mt-0">
      <div className="relative mb-16 lg:mb-0">
        <div className="relative w-full h-[145px] lg:h-[700px] mb-6 rounded-[20px] overflow-hidden">
          <Image
            src={mfk.imageUrl}
            alt={mfk.title}
            fill
            className="object-cover"
            priority
          />
          {mfk.gradient && (
            <div className={`absolute inset-0 ${mfk.gradient}`} />
          )}
        </div>

        {/* Лого + заголовок */}
        <div className="-bottom-[40px] w-full absolute lg:bottom-0 lg:left-16 lg:bottom-16 z-20 flex flex-col-reverse lg:flex-row items-start lg:items-center">

          {mfk.Logo && (
            <div className="flex justify-center w-full lg:w-[376px] h-auto rounded-[20px] overflow-hidden">
              <img
                src={mfk.Logo}
                alt="MFK logo"
                className="w-auto h-[65px] lg:w-[376px] lg:h-auto object-cover rounded-[20px]"
              />
            </div>
          )}

          <div className="mb-5 lg:mb-0 lg:mt-4 text-white text-center text-headline_2_mobile lg:text-headline_1 w-full lg:flex lg:ml-6">
            {mfk.title}
          </div>
        </div>

        <div className="hidden lg:flex lg:absolute bottom-16 flex right-16 gap-4 z-20">
          {mfk.iconNames?.map((iconName, i) =>
            iconName.link ? (
              <Link key={i} href={iconName.link} className="flex items-center">
                <Button
                  variant="accent-alt"
                  iconOnly
                  className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                >
                  <SvgIcon name={iconName.title} size={24} color="main-blue" />
                </Button>
              </Link>
            ) : (<div></div>)
          )}
        </div>

      </div>

      <div className="lg:hidden flex justify-center mb-6 gap-6">
        {mfk.iconNames?.map((iconName, i) =>
          iconName.link ? (
            <Link key={i} href={iconName.link} className="flex items-center">
              <Button
                variant="accent-alt"
                iconOnly
                className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
              >
                <SvgIcon name={iconName.title} size={24} color="main-blue" />
              </Button>
            </Link>
          ) : (null)
        )}
      </div>
      <div className="
        relative
        space-y-6
        rounded-2xl
        bg-indigo-50
        p-6
        text-main-text
        leading-relaxed
        border-b-2
        border-main-amarant
      ">
        {Array.isArray(mfk.description) && (
          mfk.description?.length > 0 && (
          <div>
            <div className="mt-6 flex justify-center">
              <p className="lg:mb-4 text-headline_4_mobile lg:text-headline_4">Про МФК</p>
            </div>
          {(mfk.description as string[]).map((t, idx) => (
            <div className="[&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2">
            <p
              key={idx}
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: t }}
            />
            </div>
          ))}
          </div>
          )
        )}
      </div>

      <div className="my-8">
        <BlogSlider categoryId={String(categoryId)} />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherMfkMarkers} id={mfkCategory.id} />
      </div>
    </div>
  );
}
