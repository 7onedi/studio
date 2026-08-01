"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Image from "next/image";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";

export interface ImageViewerItem {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ImageViewerProps {
  images: ImageViewerItem[];
  index?: number;
  onIndexChange?: (index: number) => void;
  renderThumbnails?: boolean; 
}

export function ImageViewer({
    images,
    index: controlledIndex,
    onIndexChange,
    renderThumbnails = true
 }: ImageViewerProps) {
  const [internalIndex, setInternalIndex] = useState(-1);

  const index = controlledIndex ?? internalIndex;
  const setIndex = onIndexChange ?? setInternalIndex;

  return (
    <>
        {renderThumbnails && (
            <div className="grid grid-cols-3 gap-2">
                {images.map((img, i) => (
                <button
                    key={img.src}
                    type="button"
                    onClick={() => setIndex(i)}
                    className="relative aspect-square overflow-hidden rounded"
                >
                    <Image
                    src={img.src}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 200px"
                    />
                </button>
                ))}
            </div>
        )}

        <Lightbox
            open={index >= 0}
            index={index}
            close={() => setIndex(-1)}
            slides={images}
            plugins={[Thumbnails, Zoom, Fullscreen, Counter]}
            styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.9)" } }}
            zoom={{
                maxZoomPixelRatio: 3,
                zoomInMultiplier: 1.5,
                scrollToZoom: true,
            }}
        />
    </>
  );
}