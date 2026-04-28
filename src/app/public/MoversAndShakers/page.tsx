import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import BlogSlider from "../blocks/BlogSlider";

import { getCategoryId } from '@lib/getCategoryId';


const project = categories.find(c => c.id === 4)!;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const categoryId = await getCategoryId('Movers&Shakers');
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
      {/* <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={mfkCategory.markers} />
      </div> */}
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про Movers&Shakers</p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(categoryId)} />
      </div>
    </div>
  );
}