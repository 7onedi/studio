import ArticleSlider from './blocks/ArticleSlider';
import ClientBg from "@/app/public/providers/ClientBg";
import DynamicSections from './DynamicSections';

// page.tsx
export default function Home() {
  return (
    <>
      <ClientBg bg="default" />
      <main className='overflow-hidden'>

        {/* Слайдер — повна ширина екрану */}
        <ArticleSlider />

        {/* Решта — в container */}
        <div className="container">
          <div id="directions" className="lg:px-0 py-6 md:pt-0 xl:pt-16">
            <DynamicSections />
          </div>
        </div>

      </main>
    </>
  );
}