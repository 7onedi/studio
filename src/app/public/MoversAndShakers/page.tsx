import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import MfkList from "@/app/public/blocks/MfkList";
import { initialCategories} from '@/app/public/blocks/LeafletMap/mapData';
import BlogSlider from "../blocks/BlogSlider";
import { slides } from "../blocks/ArticleSlider/slideContent";

const msSlides = slides.filter(c => c.meta.category === "m&s")!;

const project = categories.find(c => c.id === 4)!;

const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;

export default function Home() {
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
      {/* <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={mfkCategory.markers} />
      </div> */}
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про Movers&Shakers</p>
      </div>
      <div className="">
        <BlogSlider category="Movers&Shakers"/>
      </div>
    </div>
  );
}