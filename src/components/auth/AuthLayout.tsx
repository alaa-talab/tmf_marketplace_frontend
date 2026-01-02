'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import { GridPattern } from '@/components/ui/GridPattern';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    role?: 'Uploader' | 'Buyer';
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    // 3D Tilt Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        // Tilt range
        mouseX.set(x * 10);
        mouseY.set(y * 10);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const rotateX = useSpring(mouseY, { stiffness: 150, damping: 20 });
    const rotateY = useSpring(mouseX, { stiffness: 150, damping: 20 });

    // Dynamic Spotlight Gradient
    const spotlightX = useSpring(0, { stiffness: 150, damping: 20 });
    const spotlightY = useSpring(0, { stiffness: 150, damping: 20 });

    function handleSpotlightMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        spotlightX.set(clientX - left);
        spotlightY.set(clientY - top);
    }

    const background = useMotionTemplate`radial-gradient(
        650px circle at ${spotlightX}px ${spotlightY}px,
        rgba(255, 255, 255, 0.1),
        transparent 80%
      )`;

    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center bg-background transition-colors duration-300 overflow-hidden selection:bg-accent selection:text-white"
            onMouseMove={handleSpotlightMove}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/auth-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 dark:opacity-40 blur-2xl scale-110"
                    priority
                />
            </div>

            {/* Background Layers */}
            <div className="absolute inset-0 z-0 opacity-20">
                <GridPattern width={40} height={40} className="stroke-black/10 dark:stroke-white/10" />
            </div>

            {/* Animated Gradient Blob */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]"
                animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"
                animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Mouse Spotlight Layer */}
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background }}
            />

            {/* Main Content - Floating 3D Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 w-full max-w-lg p-6 md:p-12 mx-4"
            >
                {/* Glass Card Container */}
                <div className="relative bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden ring-1 ring-black/5 dark:ring-white/5 transition-colors duration-300 mt-16 md:14">

                    {/* Inner Content */}
                    <div className="relative z-20 flex flex-col items-center text-center">
                        <Link href="/" className="mb-8 hover:scale-110 transition-transform duration-300">
                            <Logo className="w-20 h-20 text-black dark:text-white" />
                        </Link>

                        <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-br from-black/80 to-black/40 dark:from-white dark:to-white/60">
                            {title}
                        </h2>

                        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-sm">
                            {subtitle}
                        </p>

                        <div className="w-full text-left">
                            {children}
                        </div>
                    </div>

                    {/* Decorative Top Border Gradient */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/10 to-transparent" />
                </div>
            </motion.div>
        </div>
    );
};
