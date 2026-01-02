'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const categories = [
    { name: "Urban Architecture", img: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop" },
    { name: "Wild Nature", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop" },
    { name: "Abstract Art", img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop" },
    { name: "Minimalist", img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1000&auto=format&fit=crop" },
];

export const CategorySection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    // On mobile, fade out. On desktop, keep 1 (or use a different logic if desired)
    const activeOpacity = isMobile ? opacity : 1;

    return (
        <section className="relative w-full bg-background py-24">
            <div ref={containerRef} className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8">

                {/* Sticky Left Column */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 flex flex-col justify-center z-10 pointer-events-none md:pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ opacity: activeOpacity }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold font-sans tracking-tight mb-6">
                            Explore <br />
                            <span className="text-accent">Categories.</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-md">
                            Find the perfect asset for your next creative project. From urban landscapes to abstract masterpieces.
                        </p>
                    </motion.div>
                </div>

                {/* Scrolling Right Column */}
                <div className="w-full md:w-1/2 flex flex-col gap-20 pb-20 pt-[10vh]">
                    {categories.map((cat, index) => (
                        <CategoryCard key={index} category={cat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CategoryCard = ({ category, index }: { category: { name: string, img: string }, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20%" }}
            transition={{ duration: 0.6 }}
            className="group relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
        >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />

            <Image
                src={category.img}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute bottom-0 left-0 p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-2">{category.name}</h3>
                <div className="h-1 w-0 bg-accent group-hover:w-full transition-all duration-500" />
            </div>
        </motion.div>
    );
}
