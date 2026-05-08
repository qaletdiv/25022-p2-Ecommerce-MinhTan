"use client";
import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type RelatedProductImageSlideProps = {
    images: string[];
    alt: string;
};

const RelatedProductImageSlide = ({ images, alt }: RelatedProductImageSlideProps) => {
    const slides = images.length > 0 ? images : ['/images/placeholder.png'];
    const [current, setCurrent] = useState(0);

    const prev = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrent((c) => (c - 1 + slides.length) % slides.length);
    };
    const next = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrent((c) => (c + 1) % slides.length);
    };

    return (
        <div className="relative w-full h-full overflow-hidden rounded-3xl bg-white">
            <img
                src={slides[current]}
                alt={alt}
                className="w-full h-full object-cover transition-opacity duration-300"
            />
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-white/80 text-pink-700 shadow hover:bg-white transition"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="w-3 h-3" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-white/80 text-pink-700 shadow hover:bg-white transition"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition ${i === current ? 'bg-pink-600' : 'bg-white/70'}`}
                                aria-label={`Image ${i + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default RelatedProductImageSlide;
