import styles from './page.module.scss';
import ArticleSlider from './blocks/ArticleSlider';
import PartnerSlider from './components/PartnerSlider';
import { CategoriesSection as Categories } from './blocks/Categories';
import BlogSlider from './blocks/BlogSlider';
import ReviewsSlider from './blocks/ReviewsSlider';
import dynamic from 'next/dynamic';

import MapLoader from '@components/MapLoader';
export default function Home() {

  return (
    <div >
      <main >
        <ArticleSlider/>
        <div className='my-6 py-4 w-full flex item-center justify-center'>
          <PartnerSlider />
        </div>
        <Categories/>
        <BlogSlider/>
        <div className="relative h-[60vw] w-full"> 
          <MapLoader /> 
        </div>
        <div className='mt-6'>
          <ReviewsSlider/>
        </div>

        {/* <h1 className={`bg-main-blue font-heading text-headline_1 w-full ${styles["mainpage_wrapper"]}`}>Головна сторінка</h1> */}
      </main>
    </div>
  );
}
