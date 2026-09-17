'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface ProjectGalleryProps {
  gallery: {
    src: string;
    alt: string;
  }[];
}

export function ProjectGallery({ gallery }: ProjectGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  }, []);

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const child = container.children[index] as HTMLElement;
    if (child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: 'smooth'
      });
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) scrollTo(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < gallery.length - 1) scrollTo(activeIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div 
      className="relative outline-none group/gallery" 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      aria-label="Galeria do projeto"
    >
      {/* Mobile Controls */}
      <div className="md:hidden absolute inset-y-0 left-0 right-0 pointer-events-none z-10 flex items-center justify-between px-2" style={{ paddingBottom: '3.5rem' }}>
        <button
          type="button"
          aria-label="Imagem anterior"
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center transition-opacity duration-200 ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <span className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-800">
            <span className="text-xl leading-none -mt-0.5 -ml-0.5 select-none">‹</span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Próxima imagem"
          onClick={handleNext}
          disabled={activeIndex === gallery.length - 1}
          className={`pointer-events-auto min-w-[44px] min-h-[44px] flex items-center justify-center transition-opacity duration-200 ${activeIndex === gallery.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <span className="w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-800">
            <span className="text-xl leading-none -mt-0.5 -mr-0.5 select-none">›</span>
          </span>
        </button>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:grid md:grid-cols-2 md:gap-12 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative scroll-smooth"
      >
        {gallery.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="flex flex-col min-w-full md:min-w-0 snap-center md:snap-align-none">
            <div className="relative aspect-[16/9] overflow-hidden bg-light-gray mb-3">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                className="object-contain transition-transform duration-700 md:group-hover/gallery:scale-[1.02]"
              />
            </div>
            <figcaption className="flex justify-between items-start gap-4">
              <span className="text-sm text-[#595959] font-normal leading-[1.6]">
                {image.alt}
              </span>
              <span className="text-xs font-semibold tracking-wider text-[#a3a3a3] md:hidden mt-0.5 whitespace-nowrap">
                {index + 1} / {gallery.length}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
