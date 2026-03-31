import CategoryTitleWrapper from "./CategoryTitleWrapper";
import BlogSlider from "../blocks/BlogSlider";
import { getCategoryId } from '@lib/getCategoryId';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoryId = await getCategoryId('Movers&Shakers');
  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitleWrapper projectId={4} />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про Movers&Shakers</p>
      </div>
      <div>
        <BlogSlider categoryId={String(categoryId)} />
      </div>
    </div>
  );
}