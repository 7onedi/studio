import styles from './page.module.scss';
import ArticleSlider from './blocks/ArticleSlider';
import PartnerSlider from './components/PartnerSlider';

export default function Home() {

  return (
    <div >
      <main >
        <ArticleSlider/>
        <div className='my-6 py-4 w-full flex item-center justify-center'>
          <PartnerSlider />
        </div>
        {/* <h1 className={`bg-main-blue font-heading text-headline_1 w-full ${styles["mainpage_wrapper"]}`}>Головна сторінка</h1> */}
      </main>
    </div>
  );
}
