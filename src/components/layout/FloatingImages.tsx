'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import Image from 'next/image';

// High-quality placeholder images
const images = [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1767257147725-89011434e351?q=80&w=1132&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1761839257469-96c78a7c2dd3?q=80&w=1169&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
];

// Column component for displaying a vertical stack of images
const Column = ({ images, y = 0 }: { images: string[], y?: MotionValue<number> | number }) => {
    return (
        <motion.div
            style={{ y }}
            className="flex flex-col gap-4 md:gap-6 w-full min-w-[160px] md:min-w-[250px]"
        >
            {images.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group shadow-lg">
                    {/* Image */}
                    {/* Image */}
                    <Image
                        src={src}
                        alt="Gallery Item"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                </div>
            ))}
        </motion.div>
    );
};

export const FloatingImages = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress relative to this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Create smooth parallax values
    // Column 1 moves UP
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    // Column 2 moves DOWN
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
    // Column 3 moves UP (Desktop only)
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);

    // Add physics for smoothness
    const smoothY1 = useSpring(y1, { stiffness: 60, damping: 20 });
    const smoothY2 = useSpring(y2, { stiffness: 50, damping: 20 });
    const smoothY3 = useSpring(y3, { stiffness: 70, damping: 20 });

    return (
        <section ref={containerRef} className="relative py-16 md:py-24 bg-background overflow-hidden min-h-[80vh] flex items-center justify-center">

            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-background to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-background to-transparent z-10" />
            </div>

            <div className="container relative z-10 mx-auto px-4 flex flex-col items-center">

                {/* Header Text */}
                <motion.div
                    className="text-center mb-16 md:mb-48 max-w-2xl px-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans tracking-tight mb-3 md:mb-4">
                        Curated Excellence
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg">
                        Explore collections hand-picked for quality and distinctiveness.
                    </p>
                </motion.div>

                {/* Parallax Grid - Responsive Layout */}
                <div className="flex gap-4 md:gap-8 w-full max-w-6xl justify-center h-[500px] sm:h-[600px] md:h-[800px] overflow-visible px-2">

                    {/* Column 1: Visible on all screens (Left on mobile) */}
                    <div className="w-1/2 md:w-1/3 mt-[60px] md:-mt-[10px]">
                        <Column
                            images={[images[0], images[1], images[2]]}
                            y={smoothY1}
                        />
                    </div>

                    {/* Column 2: Visible on all screens (Right on mobile) */}
                    <div className="w-1/2 md:w-1/3 -mt-[60px] md:-mt-[200px]">
                        <Column
                            images={[images[3], images[4], images[5]]}
                            y={smoothY2}
                        />
                    </div>

                    {/* Column 3: Desktop Only */}
                    <div className="hidden md:block md:w-1/3">
                        <Column
                            images={[images[1], images[0], images[4]]}
                            y={smoothY3}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};