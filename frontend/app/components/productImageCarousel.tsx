"use client";
import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type ProductImageCarouselProps = {
    images: string[];
};

const ProductImageCarousel = ({ images }: ProductImageCarouselProps) => {
    const slides = images.length > 0 ? images : ['/images/placeholder.png'];
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        onSelect();
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    return (
        <div className="relative rounded-3xl border border-pink-100 bg-white shadow-xl overflow-hidden">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {slides.map((image, index) => (
                        <div key={index} className="relative flex-[0_0_100%] min-w-0 h-[520px] md:h-[540px] bg-white">
                            <img
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-contain p-4"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-pink-700 shadow-md hover:bg-white transition"
                aria-label="Previous image"
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-pink-700 shadow-md hover:bg-white transition"
                aria-label="Next image"
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => scrollTo(index)}
                        className={`h-2.5 w-2.5 rounded-full transition ${selectedIndex === index ? 'bg-pink-600' : 'bg-white/80'}`}
                        aria-label={`Show image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductImageCarousel;
