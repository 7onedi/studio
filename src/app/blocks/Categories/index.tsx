import { categories } from "./categories.data";
import CategoryCard from "./CategoryCard";

export const CategoriesSection = () => {
  return (
    <section className="w-full flex flex-col items-center gap-10 md:gap-16 py-10">

      {/* Контейнер для двох колонок */}
      <div className="w-full flex flex-col md:flex-row md:justify-center md:gap-16">

        {/* Ліва колонка: 1 (верх), 2 (низ) */}
        <div className="flex flex-col items-center relative">

          {/* 1 */}
          <div className="md:-translate-x-[10vw] md:-translate-y-0">
            <CategoryCard {...categories[0]} />
          </div>

          {/* 2 */}
          <div className="md:translate-x-16 md:translate-y-[-14vw]">
            <CategoryCard {...categories[1]} />
          </div>
        </div>

        {/* Права колонка: 3 (верх), 4 (низ) */}
        <div className="lg:ml-10 flex flex-col items-center relative mt-10 md:mt-0 ">

          {/* 3 */}
          <div className="md:translate-x-0 md:-translate-y-0">
            <CategoryCard {...categories[2]} />
          </div>

          {/* 4 */}
          <div className="md:translate-x-[14vw] md:translate-y-[-14vw]">
            <CategoryCard {...categories[3]} />
          </div>
        </div>
      </div>

      {/* Кнопка */}
      <button
        className="
          mt-4 md:mt-8
          bg-main-amarant text-white font-semibold
          px-10 py-3 rounded-full
          transition-all duration-300 
          hover:bg-main-amarant/80 active:scale-95
        "
      >
        ПРИЄДНАТИСЬ
      </button>

    </section>
  );
};
