"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";

export default function ArrowToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="accent-alt"
        iconOnly
        onClick={scrollToTop}
        size="lg"
        className="shadow-[0_4px_6px_rgba(0,0,0,0.1)]
                   hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)]
                   transition-shadow hover:bg-gray-200"
      >
        <SvgIcon name="up" size={24} color="main-blue" />
      </Button>
    </div>
  );
}
