'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Camera, Users, Image as ImageIcon, TrendingUp } from 'lucide-react';

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

    // Detect mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });


    // Desktop clip path
    const clipPathDesktop = useTransform(
        scrollYProgress,
        [0, 1],
        ["inset(10% 10% 5% 10% round 40px)", "inset(0% 0% 0% 0% round 0px)"]
    );

    // Mobile clip path - less horizontal inset since screens are narrower
    const clipPathMobile = useTransform(
        scrollYProgress,
        [0, 1],
        ["inset(10% 5% 10% 5% round 30px)", "inset(0% 0% 0% 0% round 0px)"]
    );

    // Use the appropriate clip path based on screen size
    const clipPath = isMobile ? clipPathMobile : clipPathDesktop;

    // Text fades out
    const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);

    // Stats appear when text fades
    const statsOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
    const statsY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);

    // Track when stats should be interactive
    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setStatsVisible(latest > 0.3);
        });
        return unsubscribe;
    }, [scrollYProgress]);

    const stats = [
        { icon: Camera, label: 'Photos', value: '10K+' },
        { icon: Users, label: 'Creators', value: '500+' },
        { icon: ImageIcon, label: 'Collections', value: '50+' },
        { icon: TrendingUp, label: 'Daily Views', value: '100K+' },
    ];

    return (
        <div ref={containerRef} className="relative h-[200vh]">
            {/* Sticky Container */}
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-background">

                {/* Text Layer (Fades out) */}
                <motion.div
                    className="absolute z-20 text-center px-4 w-full flex flex-col items-center justify-center h-full"
                    style={{ opacity: textOpacity, scale: textScale }}
                >
                    <div className="flex flex-col items-center max-w-7xl mx-auto mt-[-5vh] md:mt-0"> {/* Slight lift on mobile */}
                        <Logo className="w-16 h-16 md:w-32 md:h-32 mb-6 md:mb-10 drop-shadow-2xl" />

                        <h1 className="text-5xl sm:text-5xl md:text-7xl font-bold font-sans tracking-tighter mb-6 md:mb-12 drop-shadow-2xl leading-[1.1]">
                            <span className="text-white">
                                Capture.
                            </span> <br />
                            <span className="text-accent drop-shadow-lg">Market.</span> <span className="text-white">Vision.</span>
                        </h1>

                        <p className="text-lg sm:text-lg md:text-xl text-white/90 mb-4 md:mb-10 max-w-sm sm:max-w-4xl drop-shadow-lg px-2 font-medium">
                            The premium marketplace for exclusive digital assets.
                        </p>

                        <div className="flex gap-3 md:gap-6 flex-col sm:flex-row w-full sm:w-auto px-8 sm:px-0">
                            <Link href="/gallery" className="w-full sm:w-auto">
                                <Button variant="primary" className="text-sm md:text-base px-6 py-4 h-auto shadow-2xl w-full sm:w-auto font-semibold tracking-wide rounded-full">
                                    Browse Gallery
                                </Button>
                            </Link>
                            <Link href="/auth/register" className="w-full sm:w-auto">
                                <Button variant="outline" className="text-sm md:text-base px-6 py-4 h-auto bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white/20 w-full sm:w-auto font-semibold tracking-wide rounded-full">
                                    Start Selling
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute md:bottom-6 bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            y: [0, 10, 0]
                        }}
                        transition={{
                            opacity: { delay: 1, duration: 1 },
                            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-white/60">Scroll</span>
                        <div className="w-px h-12 md:h-16 bg-gradient-to-b from-white/80 to-transparent" />
                    </motion.div>
                </motion.div>

                {/* Stats Layer (Appears when text fades) */}
                <motion.div
                    className={`absolute z-20 w-full px-4 h-full flex flex-col items-center justify-center ${statsVisible ? '' : 'pointer-events-none'}`}
                    style={{ opacity: statsOpacity, y: statsY }}
                >
                    <div className="w-full max-w-7xl mx-auto">
                        {/* Heading */}
                        <div className="text-center mb-10 md:mb-20">
                            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-8 drop-shadow-lg tracking-tight">
                                Trusted by Thousands
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-sm sm:max-w-4xl mx-auto px-2 drop-shadow-md leading-relaxed font-light">
                                Join our thriving community of photographers and collectors building the future of digital art.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-md md:max-w-5xl mx-auto">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="relative backdrop-blur-xl bg-white/5 dark:bg-black/40 border border-white/10 rounded-2xl md:rounded-2xl p-5 md:p-6 text-center hover:bg-white/10 dark:hover:bg-black/60 transition-all duration-500 group-hover:-translate-y-2">
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl md:rounded-2xl" />

                                        <stat.icon className="w-4 h-4 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 text-accent" />
                                        <div className="text-2xl sm:text-3xl md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tighter">
                                            {stat.value}
                                        </div>
                                        <div className="text-[10px] sm:text-xs md:text-xs text-white/50 uppercase tracking-[0.2em] font-medium">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Revealing Image Layer */}
                <motion.div
                    className="relative w-full h-full z-10"
                    style={{ clipPath }}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')",
                        }}
                    />
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                </motion.div>
            </div>
        </div>
    );
};