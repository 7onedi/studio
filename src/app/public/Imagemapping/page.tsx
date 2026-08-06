import CategoryTitleWrapper from "@components/CategoryTitleWrapper";
import BlogSlider from "../blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';
import TranslatedText from "@components/TranslatedText";
import MfkList from "@/app/public/blocks/MfkList";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Imagemapping');
  const parent = result?.parent;

    const markers = (result?.children ?? []).map((p: any) => ({
    popupContent: {
      slug:  p.subcategory?.slug ?? String(p.id),
      title: p.title,
      title_en: p.title_en,
      title_pl: p.title_pl,
      title_lt: p.title_lt,
      title_ro: p.title_ro,
      Logo:  p.logo?.url ?? p.image?.url ?? '',
      zoom:  p.body?.zoom,
      lang:  p.lang ?? 'uk',
    },
  }));

  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitleWrapper
          projectId={4}
          image={parent?.image?.url}
          title={parent?.title}
          parent={parent}
        />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={markers} id="#implaces" />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">
          <TranslatedText tKey="pages.project_preview_block.title" />
          {' Imagemapping'}
        </p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}