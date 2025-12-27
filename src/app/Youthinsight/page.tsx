import CategoryTitle from "@blocks/CategoryTitle";
import { categories } from "@blocks/Categories/categories.data";
import MfkList from "@blocks/MfkList";
import { initialCategories} from '@blocks/LeafletMap/mapData';
import BlogSlider from "../blocks/BlogSlider";

const project = categories.find(c => c.id === 2)!;

const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;

export default function Home() {
  return (
    <div>
      <div className="mt-12 lg:mt-16 px-4 lg:px-0">
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
        <p className="text-headline_3">Цікаві статті про проєкт</p>
      </div>
      <div className="">
        <BlogSlider />
      </div>
    </div>
  );
}