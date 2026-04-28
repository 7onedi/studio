import CategoryTitleWrapper from "./CategoryTitleWrapper";
import MfkList from "@/app/public/blocks/MfkList";
import BlogSlider from "@/app/public/blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';

const project = categories.find(c => c.id === 2)!;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('Youthinsight');
  const parent = result?.parent;

  const markers = (result?.children ?? []).map((p: any) => ({
    popupContent: {
      slug:  p.subcategory?.slug ?? String(p.id),
      title: p.title,
      Logo:  p.image?.url ?? '',
      zoom:  false,
    },
  }));

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
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={markers} id="youthinsight" />
      </div>
      <div className="my-8 flex justify-center">
        <TranslatedText 
          tKey="pages.category_title.title" 
          className="text-headline_3" 
        />
      </div>
      <div className="">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}