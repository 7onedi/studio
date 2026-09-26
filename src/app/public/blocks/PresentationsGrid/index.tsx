'use client';

import { useMemo, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { Button } from '@/app/public/components/Button';
import { SvgIcon } from '@/app/public/components/SvgIcon';
import PresentationCard, { PresentationEntry } from './PresentationCard';

const DESKTOP_PER_SLIDE = 10; // 2 rows x 5 cols
const MOBILE_INITIAL = 4;     // 2 rows x 2 cols
const MOBILE_STEP = 4;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

interface ArrowProps {
  onClick: () => void;
  direction: 'left' | 'right';
}

const Arrow: React.FC<ArrowProps> = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className={`
      absolute top-1/2 -translate-y-1/2
      flex items-center justify-center
      w-[72px] h-[72px]
      bg-indigo-50 rounded-full
      transition-all duration-300 hover:bg-white
      z-30 cursor-pointer
      ${direction === 'left' ? 'left-[-25px]' : 'right-[-25px]'}
    `}
    aria-label={direction === 'left' ? 'Попередній слайд' : 'Наступний слайд'}
  >
    <SvgIcon name={direction} size={24} color="main-blue" />
  </button>
);

export default function PresentationsGrid({ presentations }: { presentations: PresentationEntry[] }) {
  const [sliderReady, setSliderReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(MOBILE_INITIAL);

  const slides = useMemo(() => chunk(presentations, DESKTOP_PER_SLIDE), [presentations]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: slides.length > 1,
    mode: 'snap',
    slides: { perView: 1, spacing: 0 },
    created() {
      setSliderReady(true);
    },
  });

  if (presentations.length === 0) return null;

  const visibleMobile = presentations.slice(0, visibleCount);
  const canToggle = presentations.length > MOBILE_INITIAL;
  const isAllVisible = visibleCount >= presentations.length;

  return (
    <div className="mx-auto w-full">
      <div className="relative">
        {/* DESKTOP */}
        <div className="relative hidden lg:block">
          <div ref={sliderRef} className="keen-slider w-full">
            {slides.map((group, i) => (
              <div
                key={i}
                className="keen-slider__slide grid grid-cols-5 grid-rows-2 gap-y-8 gap-x-4 lg:gap-y-10 lg:gap-x-6 pb-4 lg:pb-5"
              >
                {group.map((p, j) => (
                  <PresentationCard key={j} presentation={p} />
                ))}
              </div>
            ))}
          </div>
          {sliderReady && slides.length > 1 && (
            <>
              <Arrow direction="left" onClick={() => instanceRef.current?.prev()} />
              <Arrow direction="right" onClick={() => instanceRef.current?.next()} />
            </>
          )}
        </div>

        {/* MOBILE */}
        <div id="presentationsList" className="grid grid-cols-2 gap-y-8 gap-x-4 pb-4 lg:hidden">
          {visibleMobile.map((p, i) => (
            <PresentationCard key={i} presentation={p} />
          ))}
        </div>
      </div>

      {canToggle && (
        <div className="mt-6 flex justify-center lg:hidden">
          <Button
            variant="primary"
            onClick={() => {
              if (isAllVisible) {
                setVisibleCount(MOBILE_INITIAL);
                document.getElementById('presentationsList')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                setVisibleCount((prev) => Math.min(prev + MOBILE_STEP, presentations.length));
              }
            }}
          >
            {isAllVisible ? 'Згорнути' : 'ДИВИТИСЬ ЩЕ'}
            <div className="ml-2 flex items-center justify-center">
              <SvgIcon name={isAllVisible ? 'up' : 'down'} size={24} color="white" />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}