"use client";
import React, { useEffect, useState } from "react";
import styles from "./SvgIcon.module.scss";

type ColorClass = keyof typeof styles;

type SvgIconProps = {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  color?: ColorClass; // Тепер передаємо ім'я класу з SCSS
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size,
  width,
  height,
  color,
}) => {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch(`/icons/${name}.svg`)
      .then((res) => res.text())
      .then((svg) => {
        const w = size || width || 24;
        const h = size || height || 24;

        // Видаляємо fill, щоб колір брався з CSS
        let updatedSvg = svg
          .replace(/width=".*?"/g, `width="${w}"`)
          .replace(/height=".*?"/g, `height="${h}"`)
          .replace(/fill=".*?"/g, "");

        setSvgContent(updatedSvg);
      })
      .catch(() => {
        console.warn(`SVG not found: ${name}.svg`);
        setSvgContent("");
      });
  }, [name, size, width, height]);

  const style: React.CSSProperties = {
    display: "inline-block",
    width: size || width,
    height: size || height,
  };

  return (
    <span
      className={color ? styles[color] : undefined}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
