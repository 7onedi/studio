import CategoryTitle from "@/app/public/blocks/CategoryTitle";
import { categories } from "@/app/public/blocks/Categories/categories.data";
import MfkList from "@/app/public/blocks/MfkList";
import { initialCategories} from '@/app/public/blocks/LeafletMap/mapData';
import BlogSlider from "@/app/public/blocks/BlogSlider";
import { slides } from "../blocks/ArticleSlider/slideContent";

const yiSlides = slides.filter(c => c.meta.category === "youthinsight")!;
const project = categories.find(c => c.id === 2)!;
const festivalCategory = initialCategories.find(c => c.id === "youthinsight")!;


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
      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={festivalCategory.markers} id={festivalCategory.id}/>
      </div>
      <div className="my-8 flex justify-center">
        <p className="text-headline_3">Цікаві статті про проєкт</p>
      </div>
      <div className="">
        <BlogSlider category="Youthinsight"/>
      </div>
    </div>
  );
}