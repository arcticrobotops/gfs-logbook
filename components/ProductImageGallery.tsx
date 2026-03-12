'use client';

import { useState } from 'react';
import Image from 'next/image';

const BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjRjJFREU1Jy8+PC9zdmc+';

interface ProductImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  if (!selectedImage) return null;

  return (
    <div>
      {/* Main image */}
      <div className="border-[2.5px] border-navy">
        <div className="px-3 py-2 flex items-center justify-between border-b-[1.5px] border-navy/20">
          <span className="font-mono text-xs tracking-[0.2em] text-graphite">
            PHOTOGRAPH &mdash; PHOTO {String(selectedIndex + 1).padStart(3, '0')}
          </span>
          <span className="diamond-sep" />
        </div>
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`border-[1.5px] transition-colors text-left ${
                i === selectedIndex
                  ? 'border-signal-red'
                  : 'border-navy/30 hover:border-navy'
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === selectedIndex}
            >
              <div className="px-2 py-1 border-b border-navy/10">
                <span className={`font-mono text-xs tracking-[0.15em] ${
                  i === selectedIndex ? 'text-signal-red' : 'text-graphite'
                }`}>
                  PHOTO {String(i + 1).padStart(3, '0')}
                </span>
              </div>
              <div className="relative aspect-square w-full">
                <Image
                  src={img.url}
                  alt={img.altText || `${title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 33vw, 16vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
