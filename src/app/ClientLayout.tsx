'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { AnimatePresence } from 'framer-motion';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Trigger loading on route change
        const handleStart = () => setLoading(true);
        const handleComplete = () => setTimeout(() => setLoading(false), 800); // Artificial delay to show animation

        handleStart();
        handleComplete();

    }, [pathname, searchParams]);

    // Initial load
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <Navbar />
                <SmoothScroll>
                    <AnimatePresence mode="wait">
                        {loading && <LoadingScreen key="loader" />}
                    </AnimatePresence>
                    <div className="min-h-screen">
                        {children}
                    </div>
                </SmoothScroll>
                {/* Footer outside SmoothScroll if we want it to be static "reveal", 
                    but inside if it's just a regular component. 
                    The reveal effect relies on z-index and fixed positioning of the footer itself. order matters. 
                    Usually Reveal Footer is: Content with z-10 and margin-bottom, Footer Fixed z-0.
                    So Footer should be physically AFTER children but visually 'under' them.
                 */}
                <Footer />
            </AuthProvider>
        </ThemeProvider>
    );
}
