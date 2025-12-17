
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
        <div className='lg:my-16'>
          <ArticleSlider/>
        </div>
        <div className='my-6 py-4 w-full flex item-center justify-center'>
          <PartnerSlider />
        </div>
        <div className={`lg:px-0 py-6 lg:pt-16`}>
        <Categories/>
        <BlogSlider/>
        <div className="relative h-[550px] lg:h-[700px] w-full"> 
          <MapLoader /> 
        </div>
        <div className='mt-6'>
          <ReviewsSlider/>
        </div>
        </div>
      </main>
    </div>
  );
}