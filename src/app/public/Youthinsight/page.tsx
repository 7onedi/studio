// Youthinsight page
import CategoryTitleWrapper from "@components/CategoryTitleWrapper";
import MfkList from "@/app/public/blocks/MfkList";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';
import TranslatedText from "@components/TranslatedText";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Youthinsight');
  const parent = result?.parent;

  const markers = (result?.children ?? []).map((p: any) => ({
    popupContent: {
      slug:  p.subcategory?.slug ?? String(p.id),
      title: p.title,
      title_en: p.title_en,
      title_pl: p.title_pl,
      title_lt: p.title_lt,
      title_ro: p.title_ro,
      Logo:  p.image?.url ?? '',
      zoom:  false,
    },
  }));

  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitleWrapper
          projectId={2}
          image={parent?.image?.url}
          title={parent?.title}
          parent={parent}
        />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={markers} id="youthinsight" />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">
          <TranslatedText tKey="pages.project_preview_block.title" />
          {' Youthinsight'}
        </p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}