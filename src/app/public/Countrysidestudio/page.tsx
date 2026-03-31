import CategoryTitleWrapper from "./CategoryTitleWrapper";
import MfkList from "@/app/public/blocks/MfkList";
import { initialCategories } from '@/app/public/blocks/LeafletMap/mapData';
import BlogSlider from "../blocks/BlogSlider";
import { getCategoryId } from '@lib/getCategoryId';
import TranslatedText from "../blocks/TranslatedText";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoryId = await getCategoryId('CountrysideStudio');
  const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;

  return (
    <div>
      <div className="mt-4 lg:mt-0">
        <CategoryTitleWrapper projectId={1} />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={mfkCategory.markers} id={mfkCategory.id} />
      </div>
      <div className="flex justify-center">
        <TranslatedText 
          tKey="pages.project_preview_block.activity" 
          className="text-headline_3" 
        />
      </div>
      <div className="mt-8 lg:mt-12 px-4 lg:px-0">
        <BlogSlider categoryId={String(categoryId)} />
      </div>
    </div>
  );
}