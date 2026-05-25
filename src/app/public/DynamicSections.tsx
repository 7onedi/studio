"use client";

import dynamic from 'next/dynamic';
import { CategoriesSection as Categories } from './blocks/Categories';

const PartnerSlider = dynamic(() => import('./components/PartnerSlider'));
const BlogSlider = dynamic(() => import('./blocks/BlogSlider'));
const ReviewsSlider = dynamic(() => import('./blocks/ReviewsSlider'));
const MapLoader = dynamic(() => import('@/app/public/components/MapLoader'));


export default function DynamicSections() {
  return (
    <>
      <div className='my-6 py-4 w-full flex item-center justify-center'>
        <PartnerSlider />
      </div>
      <Categories />
      <div className='lg:px-6 lg:mt-10 py-10 lg:py-16'>
        <BlogSlider />
      </div>
      <div id="places" className="lg:py-10 relative h-[550px] lg:h-[700px] w-full">
        <MapLoader />
      </div>
      <div className='mt-6'>
        <ReviewsSlider />
      </div>
    </>
  );
}