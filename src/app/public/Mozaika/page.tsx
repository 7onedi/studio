import CategoryTitleWrapper from "./CategoryTitleWrapper";
import BlogSlider from "../blocks/BlogSlider";
import { getCategoryId } from '@lib/getCategoryId';
import TranslatedText from "../blocks/TranslatedText";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoryId = await getCategoryId('Mozaїka');
  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitle
          image={project.image}
          pattern={project.pattern}
          gradient={project.gradient}
          hoverGradient={project.hoverGradient}
          title={project.title}
        />
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