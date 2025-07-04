import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';

interface EmblaCarouselProps {
  slides: string[];
}

export default function EmblaCarousel({ slides }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, slides]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container flex space-x-4">
        {slides.map((src, index) => (
          <div key={index} className="embla__slide flex-shrink-0 w-64 h-40 relative">
            <Image src={src} alt={`slide-${index}`} fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
