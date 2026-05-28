import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import MfkList from "@/app/public/blocks/MfkList";
import BlogSlider from "../blocks/BlogSlider";
import { getParentProject } from '@lib/getProjects';

const project = categories.find(c => c.id === 1)!;

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await getParentProject('#CountrysideStudio');
  const parent = result?.parent;
  const markers = (result?.children ?? []).map((p: any) => ({
    popupContent: {
      slug:  p.subcategory?.slug ?? String(p.id),
      title: p.title,
      Logo:  p.logo?.url ?? '',
      zoom:  p.body?.zoom,
      lang:  p.lang ?? 'uk',
    },
  }));

  return (
    <div>
      <div className="mt-4 lg:mt-0">
        <CategoryTitle
          image={parent?.image?.url ?? project.image}  // fallback на хардкод
          pattern={project.pattern}
          gradient={project.gradient}
          hoverGradient={project.hoverGradient}
          title={parent?.title ?? project.title}
          description={parent?.body ?? project.description}
        />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={markers} id="#mfk" />
      </div>
      <div className="flex justify-center">
        <p className="text-headline_3">Діяльність #Countrysidestudio</p>
      </div>
      <div className="mt-8 lg:mt-12 lg:px-0">
        <BlogSlider categoryId={String(result?.categoryId)} />
      </div>
    </div>
  );
}