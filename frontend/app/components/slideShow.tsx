"use client";
import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const SLIDES = [
    {
        id: 1,
        title: "Đánh Thức Vẻ Đẹp Tự Nhiên",
        subtitle: "Giảm giá đến 30% các sản phẩm dưỡng da Organic",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1600",
        buttonText: "Mua ngay",
        color: "bg-pink-50"
    },
    {
        id: 2,
        title: "BST Son Môi Mùa Hè",
        subtitle: "Sắc màu rạng rỡ, bền màu suốt 12 giờ",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1600",
        buttonText: "Khám phá",
        color: "bg-orange-50"
    }
];

const Slideshow = () => {
    // Cấu hình Autoplay và Loop
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    return (
        <section className="relative group overflow-hidden bg-gray-50">
            {/* Viewport */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {SLIDES.map((slide) => (
                        <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-[500px] md:h-[600px]">
                            {/* Background Image */}
                            <img
                                src={slide.image}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt={slide.title}
                            />

                            {/* Overlay Content */}
                            <div className="absolute inset-0 bg-black/20 flex items-center">
                                <div className="container mx-auto px-6 md:px-12">
                                    <div className="max-w-xl text-white space-y-6">
                                        <h2 className="text-4xl md:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-left duration-700">
                                            {slide.title}
                                        </h2>
                                        <p className="text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-left delay-150 duration-700">
                                            {slide.subtitle}
                                        </p>
                                        <Link href="/sanpham" className="inline-block px-8 py-3.5 bg-white text-gray-900 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                                            {slide.buttonText}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>

            {/* Dots Indicator (Optional) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {SLIDES.map((_, index) => (
                    <div key={index} className="w-2 h-2 rounded-full bg-white/50" />
                ))}
            </div>
        </section>
    );
};

export default Slideshow;