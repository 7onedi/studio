import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import MfkList from "@/app/public/blocks/MfkList";
import { initialCategories} from '@/app/public/blocks/LeafletMap/mapData';
import { slides } from "../blocks/ArticleSlider/slideContent";
import BlogSlider from "../blocks/BlogSlider";

const project = categories.find(c => c.id === 1)!;

const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;

const csStudioSlides = slides.filter(c => c.meta.category === "#CountrysideStudio")!;

export default function Home() {
  return (
    <div>
      <div className="mt-4 lg:mt-0">
        <CategoryTitle
          image={project.image}
          pattern={project.pattern}
          gradient={project.gradient}
          hoverGradient={project.hoverGradient}
          title={project.title}
          description={project.description}
        />
      </div>
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={mfkCategory.markers} id={mfkCategory.id} />
      </div>
      <div className="flex justify-center">
        <p className="text-headline_3">Діяльність  #Countrysidestudio</p>
      </div>
      <div className="mt-8 lg:mt-12 px-4 lg:px-0">
        <BlogSlider category="#CountrysideStudio" />
      </div>
    </div>
  );
}