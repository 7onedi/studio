import Image from "next/image";
import { initialCategories } from "@/app/public/blocks/LeafletMap/mapData";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import MfkList from "@/app/public/blocks/MfkList";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import type { RichTextItem } from "@/app/public/components/RenderRichText";
import { renderRichText } from "@/app/public/components/RenderRichText";
import FestivalContributors from "@/app/public/blocks/FestivalContributors";
import { slides } from "../../blocks/ArticleSlider/slideContent";

interface FestivalPageProps {
  params: Promise<{
    slug?: string;
    description?: RichTextItem[];
    reviews?: {name: string;
        title: string;
        text: string;
        profileImg: string;
        links?: {
          facebook?: string;
          instagram?: string;
          tiktok?: string;
        };
      }[];
  }>;
}

const yiCategory = initialCategories.find(c => c.id === "youthinsight")!;

export default async function FestivalPage({ params }: FestivalPageProps) {
  const { slug } = await params;

  // знаходимо маркер по slug
  let Festival;
  for (const category of initialCategories) {
    const found = category.markers.find(
      (marker) => marker.popupContent.slug === slug
    );
    if (found) {
      Festival = found.popupContent;
      break;
    }
  }

  if (!Festival) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Festival не знайдено
      </div>
    );
  }

  const otherFestivalMarkers = yiCategory.markers.filter(
    (marker) => marker.popupContent.slug !== slug
  );

  const yiSlides = slug
  ? slides.filter(s => s.meta.SubCategory === slug)
  : [];

  return (
    <div className="mt-6 lg:mt-0">
      <div className="relative mb-16 lg:mb-0">

        {/* Лого + заголовок */}
        <div className=" w-full lg:left-16 lg:bottom-16 z-20 flex flex-col lg:flex-row items-start lg:items-center">
            <div className="relative w-full h-[145px] lg:w-[516px] lg:h-[327px] shrink-0  rounded-[20px] overflow-hidden">
                <Image
                    src={Festival.Logo!}
                    alt={Festival.title}
                    fill
                    className="object-cover"
                />
            </div>


            <div className="my-5 lg:my-0 lg:mt-4 text-left text-headline_2_mobile lg:text-headline_2 w-full lg:flex flex-col lg:ml-6">
                {Festival.title}
                <div>
                    {Array.isArray(Festival.description) && (
                    Festival.description?.length > 0 && (
                    <div>
                        <p className="whitespace-pre-line mt-4 text-body_mobile lg:text-body">
                        {renderRichText(Festival.description as RichTextItem[])}
                        </p>
                    </div>
                    )
                    )}
                </div>
            </div>
        </div>

        {Array.isArray(Festival.reviews) && Festival.reviews.length > 0 && (
            <div className="mt-4 lg:mt-48">
                <FestivalContributors reviews={Festival.reviews} />
            </div>
        )}


        <div className="hidden lg:flex lg:absolute bottom-16 flex right-16 gap-4 z-20">
          {Festival.iconNames?.map((iconName, i) =>
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
        {Festival.iconNames?.map((iconName, i) =>
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

      <div className="my-8">
        <BlogSlider category="Youthinsight" />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherFestivalMarkers} id={yiCategory.id} />
      </div>
    </div>
  );
}
