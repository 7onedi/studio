import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import BlogSlider from "../blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';

const project = categories.find(c => c.id === 4)!;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Movers&Shakers');
  const parent = result?.parent;

  return (
    <div>
      <div className="mt-4 lg:mt-0 px-4 lg:px-0">
        <CategoryTitle
          image={parent?.image?.url ?? project.image}
          pattern={project.pattern}
          gradient={project.gradient}
          hoverGradient={project.hoverGradient}
          title={parent?.title ?? project.title}
          description={parent?.body}
        />
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про Movers&Shakers</p>
      </div>
      <div className="">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}