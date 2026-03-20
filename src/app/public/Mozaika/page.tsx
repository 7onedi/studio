import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";

import BlogSlider from "../blocks/BlogSlider";
import { getCategoryId } from '@lib/getCategoryId';

const project = categories.find(c => c.id === 3)!;

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
          description={project.description}
        />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про проєкт</p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(categoryId)} />
      </div>
    </div>
  );
}