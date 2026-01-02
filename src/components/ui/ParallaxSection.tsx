'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxProps {
    children: React.ReactNode;
    offset?: number;
    className?: string;
}

export const ParallaxSection = ({ children, offset = 50, className }: ParallaxProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return (
        <div ref={ref} className={cn("relative overflow-hidden", className)}>
            <motion.div style={{ y }} className="w-full h-full">
                {children}
            </motion.div>
        </div>
    );
};

// Helper for Background Parallax (specifically for images covering a section)
export const ParallaxBackground = ({ src, alt, speed = 0.5 }: { src: string, alt: string, speed?: number }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

    return (
        <div ref={ref} className="absolute inset-0 z-0 overflow-hidden h-full w-full">
            <motion.img
                src={src}
                alt={alt}
                style={{ y, scale: 1.1 }} // Scale slightly to avoid gaps
                className="w-full h-full object-cover"
            />
        </div>
    )
}
