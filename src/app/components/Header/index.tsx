"use client";

import Image from 'next/image';
import { useState } from 'react';
import { SvgIcon } from "@components/SvgIcon";
import { usePathname } from "next/navigation";
import Link from 'next/link'
import { Button } from "@components/Button";

export const navButtons = [
  {name:"Про мережу", link:"/AboutNetwork"},
  {name:"Методика", link:"/Methodology"},
  {name:"Напрямки", link:"/Directions"},
  {name:"Місця", link:"/Places"},
] as const;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const pathname = usePathname();

  const languages = [
    { label: 'Українська', flag: '🇺🇦', value: 'UA' },
    { label: 'English', flag: '🇬🇧', value: 'ENG' },
    { label: 'Lietuvių',flag:'🇱🇹', value: 'LT' },
    { label: 'Polski',flag:'🇵🇱', value: 'PL' },
    { label: 'Moldovenească',flag:'🇲🇩', value: 'MD' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };
  

  return (
    <header className="bg-white text-white">
      <div className="grid grid-cols-12 mb-5 flex items-center justify-between h-16">

        {/* Logo */}
        <div className="col-span-4 flex items-center pb-1">
          <Image
            src="/mobile/icys.webp"
            alt="Intercultural Youth Studio Logo"
            width={105}
            height={58}
          />
        </div>

        <div className="col-span-5 pl-4 text-main-text">
            <span className="text-headline_4_mobile">Intecultural Youth Studio</span>
          </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
          <ul className="flex space-x-6 xl:space-x-8 font-sans text-body">
            <li>
              <a href="/AboutNetwork" className="hover:text-main-blue transition-colors duration-200">
                ПРО ПРОЕКТ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-main-blue transition-colors duration-200">
                ІСТОРИКИ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-main-blue transition-colors duration-200">
                НАПРЯМКИ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-main-blue transition-colors duration-200">
                НОВИНИ
              </a>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={toggleLanguageDropdown}
              className="flex items-center text-body hover:text-main-blue transition-colors duration-200 focus:outline-none"
            >
              <span className="mr-2">🇺🇦</span> UA
              <SvgIcon name="down" />
            </button>
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-main-text hover:bg-gray-100"
                  onClick={() => setIsLanguageDropdownOpen(false)}
                >
                  <span className="mr-2 inline-block">🇬🇧</span> EN
                </a>
                {/* Add more languages as needed */}
              </div>
            )}
          </div>

          {/* Support Button */}
          <Button variant="primary">
            ПІДТРИМАТИ
          </Button>
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
        <div className="lg:hidden text-button_mobile">
          <nav className="flex flex-col items-center space-y-4">
            {navButtons.map((navButton, i) =>(
              <Link key={i} href={navButton.link} className={`py-3 block hover:text-main-amarant transition-colors duration-200 ${pathname === navButton.link ? 'text-main-amarant' : 'text-main-text'}`}>
                {navButton.name}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="relative flex  justify-between ">
              {languages.map((lang,inx) => (
                <button
                  key={inx}
                  className="flex items-center justify-center w-full py-2 text-headline_5_mobile text-main-text hover:text-main-blue transition-colors duration-200 focus:outline-none"
                >
                  <span className="mr-2">{lang.flag}</span> {lang.value}
                </button>
              ))}

            </div>

            {/* Mobile Support Button */}
            <Button variant="primary">
              ПІДТРИМАТИ
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
