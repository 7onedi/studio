import styles from './page.module.scss';

export default function Home() {
  return (
    <div >
      <main >
        <h1 className={`bg-main-blue font-heading text-headline_1 w-full ${styles["mainpage_wrapper"]}`}>Головна сторінка</h1>
      </main>
    </div>
  );
}
