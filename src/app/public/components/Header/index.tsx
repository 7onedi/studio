"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { SvgIcon } from "@/app/public/components/SvgIcon";
import { usePathname, useRouter } from "next/navigation";
import Link from 'next/link'
import { Button } from "@/app/public/components/Button";
import styles from "./Header.module.scss";

import { useLanguage, type Locale } from "@/app/providers/LanguageProvider";

export default function Header() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastYRef = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
    } else {
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
    { label: "Українська",    flag: "🇺🇦", value: "uk" },
    { label: "English",       flag: "🇬🇧", value: "en" },
    { label: "Lietuvių",      flag: "🇱🇹", value: "lt" },
    { label: "Polski",        flag: "🇵🇱", value: "pl" },
    { label: "Moldovenească", flag: "🇲🇩", value: "ro" },
  ];

  const iconNames = [
    { title: "facebook",  link: "https://www.facebook.com/icyst" },
    { title: "instagram", link: "https://www.instagram.com/intercultural.youth.studio/" },
    { title: "tiktok",    link: "https://www.tiktok.com/@pangeya.ultima" },
    { title: "youtube",   link: "https://www.youtube.com/channel/UC7gRBZfWzpQiPE6a7fliZow" },
    { title: "pangeya",   link: "https://pangeya.org.ua/" },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleLanguageDropdown = () => setIsLanguageDropdownOpen(!isLanguageDropdownOpen);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLanguageDropdownOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLanguageDropdownOpen]);

  const isHome = pathname === "/" || pathname === "/public";

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      
      // isScrolled — чи проскролили за межі "острівка"
      setIsScrolled(y > 80);

      if (isMobileMenuOpen) {
        setIsHeaderHidden(false);
        lastYRef.current = y;
        return;
      }
      const lastY = lastYRef.current;
      const delta = y - lastY;
      const THRESHOLD = 8;
      if (Math.abs(delta) < THRESHOLD) return;
      if (y > lastY && y > 80) setIsHeaderHidden(true);
      if (y < lastY) setIsHeaderHidden(false);
      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileMenuOpen]);

  return (
    <div className={`
      fixed left-0 right-0 z-[1200]
      transition-all duration-500 lg:rounded-2xl
      ${isScrolled || !isHome ? 'top-0' : 'top-6 lg:top-10'}
    `}>
      <div className="container px-6 lg:px-0">
        <header className={`
          text-main-text
          ${styles["header-wrapper"]}
          ${isHeaderHidden ? styles["header-hidden"] : styles["header-visible"]}
          ${isScrolled ? 'rounded-none' : 'rounded-2xl'}
          transition-all duration-500
        `}>
          <div className="flex items-center justify-between w-full h-16 lg:h-20 lg:border-b lg:border-main-amarant bg-indigo-50 md:px-2">

            {/* ЛІВА ЧАСТИНА — лого + назва */}
            <div className="flex items-center gap-3 shrink-0 lg:shrink">
              <Link href={"/"}>
                <Image src="/mobile/icys.webp" alt="Intercultural Youth Studio Logo" width={105} height={58} />
              </Link>
              <span className="hidden xl:inline-block xl:w-auto w-0 overflow-hidden text-main-text text-headline_4 whitespace-nowrap">
                Intercultural Youth Studio
              </span>
                {isMobileMenuOpen && (
                  <span className="lg:hidden absolute left-0 right-0 text-center text-main-text text-headline_4_mobile leading-tight pointer-events-none">
                    Intercultural<br /> Youth Studio
                  </span>
                )}
            </div>


            {/* ПРАВА ЧАСТИНА — nav + language + кнопка */}
            <div className="hidden lg:flex items-center gap-x-4 lg:gap-x-6 xl:gap-x-0 2xl:gap-x-6 min-w-0">
              <Link href="/public/Search" aria-label="Пошук" className="group shrink-0">
                <span className="text-main-text group-hover:text-main-blue transition-colors duration-200">
                  <SvgIcon name="magnifying-glass" size={20} />
                </span>
              </Link>

              {/* Nav links */}
                {navButtons.map((navButton, index) =>
                  "link" in navButton ? (
                    pathname === navButton.link ? (
                      // Активна сторінка — не клікабельна
                      <span
                        key={index}
                        className="md:mx-2 xl:mx-2 2xl:mx-5 text-main-blue shrink-0 cursor-default"
                      >
                        <span className="text-button uppercase whitespace-nowrap">{navButton.name}</span>
                      </span>
                    ) : (
                      <Link
                        key={index}
                        href={navButton.link}
                        className="md:mx-2 xl:mx-2 2xl:mx-5 hover:text-main-blue transition-colors duration-200 shrink-0"
                      >
                        <span className="text-button uppercase whitespace-nowrap">{navButton.name}</span>
                      </Link>
                    )
                  ) : (
                    <button
                      key={index}
                      onClick={() => scrollToSection(navButton.anchor)}
                      className="md:mx-2 lg:mx-2 xl:mx-5 2xl:mx-5 hover:text-main-blue transition-colors duration-200 shrink-0"
                    >
                      <span className="text-button uppercase whitespace-nowrap">{navButton.name}</span>
                    </button>
                  )
                )}

              {/* Language Switcher */}
              <div ref={dropdownRef} className="relative flex items-center shrink-0">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center gap-2 hover:text-main-blue transition-colors duration-200 focus:outline-none px-3 py-1"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: isLanguageDropdownOpen ? "12px 12px 0 0" : "12px",
                    transition: "border-radius 0ms 300ms",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <span className="text-button">{locale.toUpperCase()}</span>
                  <span>{languages.find(l => l.value === locale)?.flag}</span>
                  <span style={{
                    display: "inline-flex",
                    transition: "transform 250ms ease",
                    transform: isLanguageDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}>
                    <SvgIcon name="down" size={16} />
                  </span>
                </button>

                <div
                  className="absolute pl-2 top-full left-1/2 -translate-x-1/2 py-1 z-10 bg-indigo-50 rounded-b-xl"
                  style={{
                    minWidth: "120px",
                    maxHeight: isLanguageDropdownOpen ? "300px" : "0px",
                    opacity: isLanguageDropdownOpen ? 1 : 0,
                    transition: "max-height 300ms ease, opacity 200ms ease",
                    pointerEvents: isLanguageDropdownOpen ? "auto" : "none",
                    overflow: "hidden",
                  }}
                >
                  {languages.filter(lang => lang.value !== locale).map((lang, inx) => (
                    <button
                      key={inx}
                      onClick={() => { setLocale(lang.value); setIsLanguageDropdownOpen(false); }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-main-text hover:text-main-blue transition-colors duration-150"
                    >
                      <span className="text-button">{lang.value.toUpperCase()}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Support Button */}
              <Button
                variant="primary"
                onClick={() => router.push('/public/AboutNetwork#joinUs')}
                className="shrink-0"
              >
                {t("nav.support")}
              </Button>
            </div>

            {/* Mobile burger */}
            <div className="mt-2 lg:hidden flex items-center justify-end mr-4">
              <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
                {isMobileMenuOpen ? <SvgIcon name="xmark-solid" /> : <SvgIcon name="bars-solid" />}
              </button>
            </div>

          </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-indigo-50 pb-4 pt-5 lg:mt-0 rounded-b-lg lg:hidden text-button_mobile border-b border-main-amarant">
            <nav className="flex flex-col items-center space-y-4">

              {/* Nav links */}
              {navButtons.map((navButton, i) =>
                "link" in navButton ? (
                  <Link
                    key={i}
                    href={navButton.link}
                    onClick={closeMobileMenu}
                    className={`py-3 block hover:text-main-amarant transition-colors duration-200 ${pathname === navButton.link ? 'text-main-amarant' : 'text-main-text'}`}
                  >
                    {navButton.name}
                  </Link>
                ) : (
                  <button
                    key={i}
                    onClick={() => {
                      closeMobileMenu();
                      scrollToSection(navButton.anchor);
                    }}
                    className="py-3 block hover:text-main-amarant transition-colors duration-200 text-main-text"
                  >
                    {navButton.name}
                  </button>
                )
              )}

              {/* Mobile Search Button */}
              <Link
                href="/public/Search"
                onClick={closeMobileMenu}
                className="py-3 flex items-center gap-2 hover:text-main-amarant transition-colors duration-200 text-main-text"
              >
                <SvgIcon name="magnifying-glass" size={18} />
                <span>{t("nav.search") ?? "Пошук"}</span>
              </Link>

              {/* Mobile Language Switcher */}
              <div className="pt-4 relative flex justify-between w-full">
                {languages.map((lang, inx) => (
                  <button
                    key={inx}
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

              {/* Social Icons */}
              <div className="relative flex justify-between w-full px-4 md:px-16">
                {iconNames.map((iconName, i) => (
                  <div key={i} className="py-2 hover:text-main-blue transition-colors duration-200">
                    <Button
                      variant="accent-alt"
                      iconOnly
                      className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-shadow duration-200"
                    >
                      <Link href={iconName.link} className="flex">
                        <SvgIcon name={iconName.title} size={24} color="main-blue" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Mobile Support Button — не закриває меню */}
              <Button
                variant="primary"
                onClick={() => router.push('/public/AboutNetwork#joinUs')}
              >
                {t("nav.support")}
              </Button>

            </nav>
          </div>
        )}
      </header>
    </div>
  </div>
  );
}