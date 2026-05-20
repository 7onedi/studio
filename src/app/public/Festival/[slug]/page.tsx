import Image from "next/image";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import MfkList from "@/app/public/blocks/MfkList";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { getParentProject } from '@lib/getProjects';
import { ArticleBody } from '@blocks/ArticleBody';
import FestivalContributors from "@blocks/FestivalContributors";
interface FestivalPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function FestivalPage({ params }: FestivalPageProps) {
  const { slug } = await params;

  const result = await getParentProject('Youthinsight');
  const children = result?.children ?? [];

  const child = children.find((p: any) => p.subcategory?.slug === slug);

  if (!child) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        Festival не знайдено
      </div>
    );
  }

  const otherMarkers = children
    .filter((p: any) => p.subcategory?.slug !== slug)
    .map((p: any) => ({
      popupContent: {
        slug:  p.subcategory?.slug ?? String(p.id),
        title: p.title,
        Logo:  p.image?.url ?? '',
        zoom:  false,
      },
    }));

  const socialLinks = child.socialLinks ?? [];

  return (
    <div className="mt-6 lg:mt-0">
      <div className="relative mb-16 lg:mb-0">

{/* Лого + заголовок */}
<div className="w-full lg:left-16 lg:bottom-16 z-20 flex flex-col lg:flex-row items-start lg:items-center">
  <div className="lg:flex-col flex items-center w-full lg:w-auto">
    <div className="relative w-full h-[200px] lg:w-[516px] lg:h-[327px] shrink-0 rounded-[20px] overflow-hidden">
      <Image
        src={child.image?.url ?? ''}
        alt={child.title}
        fill
        className="object-cover"
      />
    </div>

        {/* Соцмережі під банером */}
      {socialLinks.length > 0 && (
        <div className="flex gap-4 mt-4">
          {socialLinks.map((s: any, i: number) => (
            <Link key={i} href={s.url}>
              <Button variant="accent-alt" iconOnly
                className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200">
                <SvgIcon name={s.social?.platform?.toLowerCase() ?? 'instagram'} size={24} color="main-blue" />
              </Button>
            </Link>
          ))}
        </div>
      )}
  </div>

  <div className="my-5 lg:my-0 lg:mt-4 text-left w-full lg:flex flex-col lg:ml-6">
    <p className="text-headline_2_mobile lg:text-headline_2 font-bold">{child.title}</p>

    {/* Опис через ArticleBody */}
    {child.body?.blocks?.length > 0 && (
      <div className="mt-4 text-body_mobile lg:text-body">
        <ArticleBody blocks={child.body.blocks as any[]} />
      </div>
    )}
  </div>
</div>
        

        {/* Соцмережі десктоп */}
        {/* <div className="hidden lg:flex lg:absolute bottom-16 right-16 gap-4 z-20">
          {socialLinks.map((s: any, i: number) => (
            <Link key={i} href={s.url}>
              <Button variant="accent-alt" iconOnly
                className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200">
                <SvgIcon name={s.social?.platform?.toLowerCase() ?? 'instagram'} size={24} color="main-blue" />
              </Button>
            </Link>
          ))}
        </div> */}
      </div>

      {/* Соцмережі мобайл */}
      {/* <div className="lg:hidden flex justify-center mb-6 gap-6">
        {socialLinks.map((s: any, i: number) => (
          <Link key={i} href={s.url}>
            <Button variant="accent-alt" iconOnly
              className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200">
              <SvgIcon name={s.social?.platform?.toLowerCase() ?? 'instagram'} size={24} color="main-blue" />
            </Button>
          </Link>
        ))}
      </div> */}

      {/* Карточки учасників */}
      <div>
        {Array.isArray(child.body?.contributors) && child.body.contributors.length > 0 && (
          <div className="mt-4 lg:mt-48">
            <FestivalContributors reviews={child.body.contributors} />
          </div>
        )}
      </div>

      <div className="my-8">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherMarkers} id="youthinsight" />
      </div>
    </div>
  );
}