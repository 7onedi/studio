import CategoryTitleWrapper from "@components/CategoryTitleWrapper";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import BlogSlider from "../blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';
import TranslatedText from "@components/TranslatedText";

const project = categories.find(c => c.id === 3)!;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Mozaїka');
  const parent = result?.parent;

  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitleWrapper
          projectId={3}
          image={parent?.image?.url}
          title={parent?.title}
          parent={parent}
        />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">
          <TranslatedText tKey="pages.project_preview_block.title" />
          {' Mozaїka'}
        </p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}