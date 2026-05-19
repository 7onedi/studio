
import ArticleSlider from './blocks/ArticleSlider';
import PartnerSlider from './components/PartnerSlider';
import { CategoriesSection as Categories } from './blocks/Categories';
import BlogSlider from './blocks/BlogSlider';
import ReviewsSlider from './blocks/ReviewsSlider';
import dynamic from 'next/dynamic';
import ClientBg from "@/app/public/providers/ClientBg";

import MapLoader from '@/app/public/components/MapLoader';
export default function Home() {

  return (
    <>
      <ClientBg bg="default" />
      <div >
        <main className='overflow-hidden'>
          <div className='relative rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3),0_8px_25px_-8px_rgba(0,0,0,0.2),0_2px_8px_-2px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),0_8px_25px_-8px_rgba(0,0,0,0.5),0_2px_8px_-2px_rgba(0,0,0,0.4)]'>
            <ArticleSlider/>
          </div>
          <div className='my-6 py-4 w-full flex item-center justify-center'>
            <PartnerSlider />
          </div>
          <div id="directions" className={`lg:px-0 py-6 lg:pt-16`}>
          <Categories/>
          <div className='px-4 sm:px-6 lg:mt-10 py-10 lg:py-16'>
            <BlogSlider/>
          </div>
          <div id="places" className="lg:py-10 relative h-[550px] lg:h-[700px] w-full"> 
            <MapLoader /> 
          </div>
          <div className='mt-6'>
            <ReviewsSlider/>
          </div>
          </div>
        </main>
      </div>
    </>
  );
}