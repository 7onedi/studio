import Image from "next/image";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import MfkList from "@/app/public/blocks/MfkList";
import Link from "next/link";
import { Button } from "@/app/public/components/Button";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { getParentProject } from '@lib/getProjects';
import { ArticleBody } from '@blocks/ArticleBody';

interface MfkPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function MfkPage({ params }: MfkPageProps) {
  const { slug } = await params;

  const result = await getParentProject('#CountrysideStudio');
  const children = result?.children ?? [];

  // знаходимо поточний дочірній проект по slug підкатегорії
  const child = children.find((p: any) => p.subcategory?.slug === slug);
  console.log(JSON.stringify(child.body.blocks, null, 2));

  if (!child) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        MFK не знайдено
      </div>
    );
  }

  // інші МФК для списку внизу
  const otherMarkers = children
    .filter((p: any) => p.subcategory?.slug !== slug)
    .map((p: any) => ({
      popupContent: {
        slug:  p.subcategory?.slug ?? String(p.id),
        title: p.title,
        Logo:  p.logo?.url ?? p.image?.url ?? '',
        zoom:  false,
      },
    }));

  const socialLinks = child.socialLinks ?? [];
  console.log(JSON.stringify(child, null, 2));

  return (
    <div className="mx-auto mt-4 lg:mt-0">
      <div className="relative mb-16 lg:mb-0">
        <div className="relative w-full h-[145px] lg:h-[700px] mb-6 rounded-[20px] overflow-hidden">
          <Image
            src={child.image?.url ?? ''}
            alt={child.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Лого + заголовок */}
        <div className="-bottom-[40px] w-full absolute lg:bottom-0 lg:left-16 lg:bottom-16 z-20 flex flex-col-reverse lg:flex-row items-start lg:items-center">
          
          {child.logo?.url && (
            <div className="flex justify-center w-full lg:w-[376px] h-auto rounded-[20px] overflow-hidden">
              <img
                src={child.logo.url}
                alt="MFK logo"
                className="w-auto h-[65px] lg:w-[376px] lg:h-auto object-cover rounded-[20px]"
              />
            </div>
          )}

          <div className="mb-5 lg:mb-0 lg:mt-4 text-white text-center text-headline_2_mobile lg:text-headline_1 w-full lg:flex lg:ml-6">
            {child.title}
          </div>
        </div>

        {/* Соцмережі десктоп */}
        <div className="hidden lg:flex lg:absolute bottom-16 right-16 gap-4 z-20">
          {socialLinks.map((s: any, i: number) => (
            <Link key={i} href={s.url}>
              <Button variant="accent-alt" iconOnly
                className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200">
                <SvgIcon name={s.social?.platform?.toLowerCase() ?? 'instagram'} size={24} color="main-blue" />
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Соцмережі мобайл */}
      <div className="lg:hidden flex justify-center mb-6 gap-6">
        {socialLinks.map((s: any, i: number) => (
          <Link key={i} href={s.url}>
            <Button variant="accent-alt" iconOnly
              className="lg:mx-1 shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200">
              <SvgIcon name={s.social?.platform?.toLowerCase() ?? 'instagram'} size={24} color="main-blue" />
            </Button>
          </Link>
        ))}
      </div>

      {/* Опис */}
      {child.body?.blocks?.length > 0 && (
        <div className="relative space-y-6 rounded-2xl bg-indigo-50 p-6 text-main-text leading-relaxed border-b-2 border-main-amarant">
          <div className="mt-6 flex justify-center">
            <p className="lg:mb-4 text-headline_4_mobile lg:text-headline_4">Про МФК</p>
          </div>
          <ArticleBody blocks={child.body.blocks as any[]} />
        </div>
      )}

      <div className="my-8">
        <BlogSlider 
          categoryId={String(child.categoryId)} 
          subcategoryId={String(child.subcategoryId)} 
        />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherMarkers} id="#mfk" />
      </div>
    </div>
  );
}