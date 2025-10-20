"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';

const heroImages = [
    '/images/main.jpg',
    '/images/main2.jpg',
    '/images/main3.jpg'
];

export default function HeroCarousel({ className }: { className?: string }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrent((c) => (c + 1) % heroImages.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <Image
            key={current}
            src={heroImages[current]}
            alt="Main background"
            fill
            className={`object-cover transition-all duration-700 slow-zoom ${className ?? ''}`}
        />
    );
}
