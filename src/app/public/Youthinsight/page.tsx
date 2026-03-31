import CategoryTitleWrapper from "./CategoryTitleWrapper";
import MfkList from "@/app/public/blocks/MfkList";
import { initialCategories } from '@/app/public/blocks/LeafletMap/mapData';
import BlogSlider from "@/app/public/blocks/BlogSlider";
import { getCategoryId } from '@lib/getCategoryId';
import TranslatedText from "../blocks/TranslatedText";

export const dynamic = 'force-dynamic';

const festivalCategory = initialCategories.find(c => c.id === "youthinsight")!;

export default async function Home() {
  const categoryId = await getCategoryId('Youthinsight');
  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitleWrapper projectId={2} />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={festivalCategory.markers} id={festivalCategory.id} />
      </div>
      <div className="my-8 flex justify-center">
        <TranslatedText 
          tKey="pages.category_title.title" 
          className="text-headline_3" 
        />
      </div>
      <div>
        <BlogSlider categoryId={String(categoryId)} />
      </div>
    </div>
  );
}