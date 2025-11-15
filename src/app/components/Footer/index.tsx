import Image from 'next/image';
import styles from "./Footer.module.scss";
import Link from 'next/link';

export const navButtons = [
  {name:"Про мережу", link:"/AboutNetwork"},
  {name:"Методика", link:"/Methodology"},
  {name:"Напрямки", link:"/Directions"},
  {name:"Місця", link:"/Places"},
] as const;

export const contactButtons = [
  {name:"Email", link:"/"},
  {name:"Phone", link:"/"},
  {name:"pangeya.org.ua", link:"https://pangeya.org.ua/"},
] as const;

export const donorsAndPartners = [
  {title:"co-founded by the european union", image:"/partners/Co-f_EU.png", link:"https://youth.europa.eu/"},
] as const;

export default function Places() {
  return (
    <footer className={`mt-6 ${styles["footer-wrapper"]}`}>
      <div className="lg:pt-7 grid grid-cols-12 gap-4">
        {/* Навігація (на мобільних зверху) */}
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 lg:col-start-2 lg:col-span-5'>
              {navButtons.map((navButton, i) => (
                <Link
                  key={i}
                  href={navButton.link}
                  className="py-2 lg:mb-8 lg:pb-6 block hover:text-main-amarant duration-200"
                >
                  {navButton.name}
                </Link>
              ))}
            </div>
            <div className='col-span-12 lg:col-span-5'>
              {contactButtons.map((contactButton, idx) => (
                <Link
                  key={idx}
                  href={contactButton.link}
                  className={`py-2 lg:mb-8 lg:pb-6 block hover:text-main-amarant duration-200 ${
                    !contactButton.link.startsWith("/") ? "underline" : ""
                  }`}
                >
                  {contactButton.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Логотип + партнери */}
        <div className="col-span-12 lg:col-span-4 order-2 lg:order-1">
          <div className="py-2 flex items-center pb-1">
            <Image
              src="/mobile/icys.webp"
              alt="Intercultural Youth Studio Logo"
              width={105}
              height={58}
            />
          </div>
          <div className="py-0 text-main-text ml-2">
            <span className="text-headline_4 lg:text-headline_4">Intecultural Youth Studio</span>
          </div> 
          <div className="pt-4 flex flex-col gap-2">
            {donorsAndPartners.map((partner, inx) => (
              <Link key={inx} href={partner.link}>
                <Image
                  src={partner.image}
                  alt={partner.title}
                  width={342}
                  height={72}
                />
              </Link>
            ))}
          </div>

          <div className="py-6">
            <span className="text-main-text">© Всі права захищено. 2025</span>
          </div>
        </div>
      </div>

    </footer>
  );
}