"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link'
import { Button } from "@/app/public/components/Button";
import styles from "./Header.module.scss";

import { useLanguage, type Locale } from "@/app/providers/LanguageProvider";

interface HeaderProps {
  onScrollTo: (id: string) => void;
}

export default function Header() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastYRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      // якщо ми не на головній — переходимо на /
      router.push(`/#${id}`);
    } else {
      // якщо вже на головній — просто скролимо
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { locale, setLocale, t } = useLanguage();

  const navButtons = [
    { name: t("nav.about"),       link: "/public/AboutNetwork" },
    { name: t("nav.methodology"), link: "/public/Methodology" },
    { name: t("nav.directions"),  anchor: "directions" },
    { name: t("nav.places"),      anchor: "places" },
  ] as const;
  const languages: { label: string; flag: string; value: Locale }[] = [
    { label: "Українська", flag: "🇺🇦", value: "uk" },
    { label: "English",    flag: "🇬🇧", value: "en" },
    { label: "Lietuvių",   flag: "🇱🇹", value: "lt" },
    { label: "Polski",     flag: "🇵🇱", value: "pl" },
    { label: "Moldovenească", flag: "🇲🇩", value: "ro" },
  ];

const iconNames = [
  {
    title: "facebook",
    link: "https://www.facebook.com/icyst"
  },
  {
    title: "instagram",
    link: "https://www.instagram.com/intercultural.youth.studio/"
  }, 
  {
    title: "tiktok",
    link: "https://www.tiktok.com/@pangeya.ultima"
  }, 
  {
    title: "youtube",
    link: "https://www.youtube.com/channel/UC7gRBZfWzpQiPE6a7fliZow"
  },
  {
    title: "pangeya",
    link: "https://pangeya.org.ua/"
  },
];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  useEffect(() => {
  lastYRef.current = window.scrollY;

  const onScroll = () => {
    // якщо відкрите мобільне меню — не ховаємо хедер
    if (isMobileMenuOpen) {
      setIsHeaderHidden(false);
      lastYRef.current = window.scrollY;
      return;
    }

    const y = window.scrollY;
    const lastY = lastYRef.current;

    // невеликий поріг, щоб не смикалось від мікроскролу
    const delta = y - lastY;
    const THRESHOLD = 8;

    if (Math.abs(delta) < THRESHOLD) return;

    // вниз — ховаємо (але не на самому верху сторінки)
    if (y > lastY && y > 80) setIsHeaderHidden(true);

    // вгору — показуємо
    if (y < lastY) setIsHeaderHidden(false);

    lastYRef.current = y;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, [isMobileMenuOpen]);

  

  return (
    <header
      className={`
        bg-transparent text-white
        ${styles["header-wrapper"]}
        ${isHeaderHidden ? styles["header-hidden"] : styles["header-visible"]}
      `}
    >
      <div className="
        grid grid-cols-12
        flex items-center justify-between
        h-16 lg:container lg:grid-cols-12
        lg:h-20 lg:border-b lg:border-main-amarant
        bg-indigo-50 lg:mb-0"
      >

        {/* Logo */}
        <div className="col-span-4 lg:col-span-1 flex items-center pb-1">
          <Link href={"/"}>    
            <Image
              src="/mobile/icys.webp"
              alt="Intercultural Youth Studio Logo"
              width={105}
              height={58}
            />
          </Link>
        </div>
        <div
          className={`
            col-span-5 pl-2 lg:pl-0 text-main-text
            ${isMobileMenuOpen ? "block" : "hidden"}
            lg:block
          `}
        >
          <span className="text-headline_4_mobile lg:text-headline_4">
            Intercultural Youth Studio
          </span>
        </div>
        {!isMobileMenuOpen && (
          <div className="block lg:hidden col-span-5 h-4"></div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:block lg:col-span-6 col-span-6 flex items-center justify-between w-full pl-0 pr-0">
          <div className="flex items-center space-x-8 w-full justify-between font-sans text-main-text">
            {navButtons.map((navButton, index) =>
              "link" in navButton ? (
                <Link
                  key={index}
                  href={navButton.link}
                  className="flex items-center hover:text-main-blue transition-colors duration-200"
                  >
                  <span className="text-button uppercase text-center">{navButton.name}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(navButton.anchor)}
                  className="flex items-center hover:text-main-blue transition-colors duration-200"
                >
                  <span className="text-button uppercase text-center">{navButton.name}</span>
                </button>
              )
            )}

            {/* Language Switcher */}
            <div className="relative flex items-center space-x-2">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center text-main-text hover:text-main-blue transition-colors duration-200 focus:outline-none"
              >
                  <span className="text-button pr-2">{locale.toUpperCase()}</span>
                  <span className="pr-4">{languages.find(l => l.value === locale)?.flag}</span>
                <SvgIcon name="down" />
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                  {languages.map((lang, inx) => (
                    <div key={inx}>
                      <button
                        onClick={() => {
                          setLocale(lang.value);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex justify-between
                          ${locale === lang.value ? "text-main-blue font-bold" : "text-main-text"}`}
                      >
                        <span className="mr-2 text-button inline-block">{lang.value.toUpperCase()}</span>
                        <span className="mr-2 inline-block">{lang.flag}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support Button */}
            <Button
              variant="primary"
              onClick={() => router.push('/public/AboutNetwork#joinUs')}
              > 
              {t("nav.support")}
            </Button>
          </div>
        </nav>


        {/* Mobile Menu Button */}
        <div className="col-span-3 lg:hidden flex items-end justify-end">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <SvgIcon name="xmark-solid"/> : <SvgIcon name="bars-solid"/>}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="bg-indigo-50 pb-4 pt-5 lg:mt-0 rounded-b-lg lg:hidden text-button_mobile">
          <nav className="flex flex-col items-center space-y-4">
            {navButtons.map((navButton, i) =>
              "link" in navButton ? (
                <Link key={i} href={navButton.link} onClick={closeMobileMenu}
                  className={`py-3 block hover:text-main-amarant transition-colors duration-200 ${pathname === navButton.link ? 'text-main-amarant' : 'text-main-text'}`}>
                  {navButton.name}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={() => {
                    closeMobileMenu();
                    scrollToSection(navButton.anchor);
                  }}
                  className={`py-3 block hover:text-main-amarant transition-colors duration-200 text-main-text`}
                >
                  {navButton.name}
                </button>
              )
            )}

            {/* Mobile Language Switcher */}
            <div className="pt-4 relative flex justify-between w-full">
              {languages.map((lang,inx) => (
                <button
                  onClick={() => setLocale(lang.value)}
                  className={`flex items-center justify-center w-full py-2 text-headline_5_mobile
                    hover:text-main-blue transition-colors duration-200 focus:outline-none
                    ${locale === lang.value ? "text-main-blue font-bold" : "text-main-text"}`}
                >
                  <span className="mr-1">{lang.value.toUpperCase()}</span>
                  <span>{lang.flag}</span>
                </button>
              ))}
            </div>
            <div className=" relative flex justify-between w-full">
              {iconNames.map((iconName,i) => (
                <div
                  key={i}
                  className="py-2 hover:text-main-blue transition-colors duration-200 focus:outline-none"
                >
                  <Button
                    variant="accent-alt"
                    iconOnly
                    className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-shadow duration-200"
                  >
                    <Link href={iconName.link} className='flex'>
                      <SvgIcon name={iconName.title} size={24} color="main-blue" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* Mobile Support Button */}
            <Button variant="primary" onClick={() => scrollToSection("joinUs")}>
              {t("nav.support")}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
