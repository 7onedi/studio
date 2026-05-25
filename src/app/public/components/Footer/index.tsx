"use client";

import Image from 'next/image';
import styles from "./Footer.module.scss";
import Link from 'next/link';
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface DonorFromApi {
  id: number;
  name: string;
  image?: { id: number; url: string } | null;
  link?: string | null;
}


export const contactButtons = [
  {name: "youth.studio.vin@gmail.com", link: "https://mail.google.com/mail/u/0/?view=cm&fs=1&to=youth.studio.vin@gmail.com"},
  {name: "+380976402756", link: "tel:+380976402756"},
  {name:"pangeya.org.ua", link:"https://pangeya.org.ua/"},
] as const;

export const donorsAndPartners = [
  {title:"co-founded by the european union", image:"/partners/Co-f_EU.png", link:"https://youth.europa.eu/"},
] as const;

export default function Places() {
  const { t } = useLanguage();
  const navButtons = [
    {name:t("footer.about"), link:"/public/AboutNetwork"},
    {name:t("footer.methodology"), link:"/public/Methodology"},
    {name:t("footer.directions"), link:"/public/Directions"},
    {name:t("footer.places"), link:"/public/Places"},
] as const;
// додай вгорі компонента:
const [donors, setDonors] = useState<DonorFromApi[]>([]);
const [sliderRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  slides: { perView: 1, spacing: 16 },
  drag: true,
});

useEffect(() => {
  fetch("/api/partners/search?role=DONOR&published=true&status=APPROVED&limit=100&page=1")
    .then((r) => r.json())
    .then((d) => setDonors(Array.isArray(d.data) ? d.data : []))
    .catch(console.error);
}, []);

const pathname = usePathname();

  return (
    <footer className={`mt-6 ${styles["footer-wrapper"]}`}>
      <div className="lg:pt-7 grid grid-cols-12 gap-4">
        {/* Навігація (на мобільних зверху) */}
        <div className="col-span-12 lg:col-span-6 order-1 lg:order-2">
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 lg:col-start-2 lg:col-span-5'>
              {navButtons.map((navButton, i) => (
                pathname === navButton.link ? (
                  <span
                    key={i}
                    className="py-2 lg:mb-6 lg:pb-2 block text-main-amarant cursor-default"
                  >
                    {navButton.name}
                  </span>
                ) : (
                  <Link
                    key={i}
                    href={navButton.link}
                    className="py-2 lg:mb-6 lg:pb-2 block hover:text-main-amarant duration-200"
                  >
                    {navButton.name}
                  </Link>
                )
              ))}
            </div>
            <div className='col-span-12 lg:col-span-5'>
              {contactButtons.map((contactButton, idx) => (
                <Link
                  key={idx}
                  href={contactButton.link}
                  target="_blank"
                  className={`py-2 lg:mb-6 lg:pb-2 block hover:text-main-amarant duration-200 ${
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
            <Link href={"/"}>        
              <Image
                src="/mobile/icys.webp"
                alt="Intercultural Youth Studio Logo"
                width={105}
                height={58}
              />
            </Link>
          </div>
          <div className="py-0 text-main-text ml-2">
            <span className="text-headline_4 lg:text-headline_4">Intercultural Youth Studio</span>
          </div> 
          <div className="pt-4 flex flex-col gap-2">
            {donors.length > 0 && (
              <div className="w-[342px] overflow-hidden">
                <div ref={sliderRef} className="keen-slider">
                  {donors.map((donor) => (
                    <div key={donor.id} className="keen-slider__slide h-[72px] flex justify-center items-center">
                      {donor.image?.url && (
                        donor.link ? (
                          <Link href={donor.link} target="_blank" rel="noopener noreferrer">
                            <Image src={donor.image.url} alt={donor.name} width={342} height={72} className="object-contain" />
                          </Link>
                        ) : (
                          <Image src={donor.image.url} alt={donor.name} width={342} height={72} className="object-contain" />
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="py-6">
            <span className="text-main-text">{t("copyright")}</span>
          </div>
        </div>
      </div>

    </footer>
  );
}