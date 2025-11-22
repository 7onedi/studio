import { categories } from "./categories.data";
import CategoryCard from "./CategoryCard";
import styles from './Categories.module.scss';
import { Button } from "@components/Button";
import Link from "next/link";
import Image from "next/image";

export const CategoriesSection = () => {
  return (
    <section className="w-full lg:h-[960px] flex flex-col items-center gap-10 lg:gap-16 lg:pt-10">

      {/* Контейнер для двох колонок */}
      <div className="w-full flex flex-col md:flex-row md:justify-center lg:gap-16">

        {/* Ліва колонка: 1 (верх), 2 (низ) */}
        <div className="flex flex-row items-center relative">

          {/* 1 */}
          <div className="lg:-translate-x-[-13vw] lg:-translate-y-0">
            <CategoryCard {...categories[0]} />
          </div>

          {/* 2 */}
          <div className="lg:translate-x-14 lg:translate-y-[10vw]">
            <CategoryCard {...categories[1]} />
          </div>
        </div>

        {/* Права колонка: 3 (верх), 4 (низ) */}
        <div className="lg:ml-10 flex flex-row items-center relative mt-10 md:mt-0 ">

          {/* 3 */}
          <div className="lg:translate-x-[-1.5vw] lg:-translate-y-0">
            <CategoryCard {...categories[2]} />
          </div>

          {/* 4 */}
          <div className="lg:translate-x-[-11.8vw] lg:translate-y-[10vw]">
            <CategoryCard {...categories[3]} />
          </div>
        </div>
      </div>

      {/* Кнопка */}
      <div className={`${styles["button_primary"]} flex flex-cols justify-between items-center`}>
        <Image
            src="/categories/CB_LeftArrow.svg"
            alt="Left Arrow"
            width={66}
            height={41}
        />
        <Button variant="primary" className="mx-6 lg:w-[500px]">
          <Link href="https://pangeya.org.ua/#join">ПРИЄДНАТИСЬ</Link>
        </Button>
        <Image
            src="/categories/CB_RightArrow.svg"
            alt="Right Arrow"
            width={66}
            height={41}
        />
      </div>

    </section>
  );
};
