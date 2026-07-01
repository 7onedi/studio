import CategoryTitleWrapper from "@components/CategoryTitleWrapper";
import BlogSlider from "../blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';
import TranslatedText from "@components/TranslatedText";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Imagemapping');
  const parent = result?.parent;

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