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

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (isMobileMenuOpen) {
        setIsHeaderHidden(false);
        lastYRef.current = window.scrollY;
        return;
      }
      const y = window.scrollY;
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
        <nav className="hidden lg:flex lg:col-span-6 items-center justify-between w-full">
          <div className="flex items-center justify-between w-full font-sans text-main-text gap-x-6">

            {/* Nav links — рівномірно розподілені */}
            {navButtons.map((navButton, index) =>
              "link" in navButton ? (
                <Link
                  key={index}
                  href={navButton.link}
                  className="flex-1 flex items-center justify-center hover:text-main-blue transition-colors duration-200"
                >
                  <span className="text-button uppercase text-center whitespace-nowrap">{navButton.name}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={() => scrollToSection(navButton.anchor)}
                  className="flex-1 flex items-center justify-center hover:text-main-blue transition-colors duration-200"
                >
                  <span className="text-button uppercase text-center whitespace-nowrap">{navButton.name}</span>
                </button>
              )
            )}

            {/* Search Icon Button */}
            <Link
              href="/public/search"
              aria-label="Пошук"
              className="group flex items-center justify-center shrink-0"
            >
              <span
                style={{ color: "inherit", fill: "currentColor" }}
                className="text-main-text group-hover:text-main-blue transition-colors duration-200 [&_svg]:fill-current"
              >
                <SvgIcon name="magnifying-glass" size={20} />
              </span>
            </Link>

            {/* Language Switcher */}
            <div className="relative flex items-center shrink-0">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center gap-2 text-main-text hover:text-main-blue transition-colors duration-200 focus:outline-none"
              >
                <span className="text-button">{locale.toUpperCase()}</span>
                <span>{languages.find(l => l.value === locale)?.flag}</span>
                <span
                  style={{
                    display: "inline-flex",
                    transition: "transform 250ms ease",
                    transform: isLanguageDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <SvgIcon name="down" size={16} />
                </span>
              </button>

              {isLanguageDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 py-1 z-10 rounded-xl overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                    minWidth: "120px",
                  }}
                >
                  {languages.filter(lang => lang.value !== locale).map((lang, inx) => (
                    <button
                      key={inx}
                      onClick={() => {
                        setLocale(lang.value);
                        setIsLanguageDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-main-text hover:text-main-blue transition-colors duration-150"
                    >
                      <span className="text-button">{lang.value.toUpperCase()}</span>
                      <span>{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
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
        </nav>

        {/* Mobile Menu Button */}
        <div className="col-span-3 lg:hidden flex items-end justify-end">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            {isMobileMenuOpen ? <SvgIcon name="xmark-solid" /> : <SvgIcon name="bars-solid" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="bg-indigo-50 pb-4 pt-5 lg:mt-0 rounded-b-lg lg:hidden text-button_mobile">
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
            <div className="relative flex justify-between w-full">
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
  );
}