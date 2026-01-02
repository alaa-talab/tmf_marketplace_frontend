'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { CiMenuFries } from "react-icons/ci";

export const Navbar = () => {
    const { user, logout } = useAuth();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Rotate logo based on scroll
    const logoRotation = useTransform(scrollY, [0, 1000], [0, 360]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    // Lock body scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: "circOut",
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            y: "0%",
            transition: {
                duration: 0.5,
                ease: "circOut",
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    } as const;

    const itemVariants = {
        closed: { y: 80, opacity: 0 },
        open: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "circOut" } }
    } as const;

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: -100 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl rounded-full transition-all duration-300 border border-transparent",
                scrolled
                    ? "bg-background/60 backdrop-blur-md border-white/10 shadow-lg py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div style={{ rotate: logoRotation }}>
                        <Logo className="w-8 h-8 group-hover:text-accent transition-colors" />
                    </motion.div>
                    <span className="font-sans font-bold text-lg tracking-tight group-hover:text-accent transition-colors">TMF</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/gallery" className="text-sm font-medium hover:text-accent transition-colors">
                        Gallery
                    </Link>
                    {user?.role === 'Uploader' && (
                        <Link href="/dashboard" className="text-sm font-medium hover:text-accent transition-colors">
                            Dashboard
                        </Link>
                    )}

                    <div className="h-6 w-px bg-border" /> {/* Separator */}

                    <ThemeToggle />

                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link href="/auth/login" className="text-sm font-medium hover:text-foreground/80">
                                Sign In
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="primary" className="h-9 px-4 text-xs">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Button variant="ghost" className="h-9 px-4 text-xs" onClick={logout}>
                            Sign Out
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden relative z-50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <CiMenuFries className='w-6 h-6' />}
                </button>
            </div>

            {/* Mobile Menu - Fullscreen Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl flex flex-col justify-center items-center h-[100dvh]"
                    >
                        {/* Decorative Background Blob */}
                        <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex flex-col items-center gap-8 relative z-50">
                            {[
                                { href: "/gallery", label: "Gallery" },
                                ...(user?.role === 'Uploader' ? [{ href: "/dashboard", label: "Dashboard" }] : []),
                                ...(!user ? [
                                    { href: "/auth/login", label: "Sign In" },
                                    { href: "/auth/register", label: "Get Started", isButton: true }
                                ] : [
                                    { href: "#", label: "Sign Out", action: logout }
                                ])
                            ].map((item, i) => (
                                <motion.div key={i} variants={itemVariants} className="overflow-hidden">
                                    {item.action ? (
                                        <button
                                            onClick={() => { item.action(); setMobileMenuOpen(false); }}
                                            className="text-4xl md:text-6xl font-black tracking-tighter hover:text-accent transition-colors py-2"
                                        >
                                            {item.label}
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "block text-4xl md:text-6xl font-black tracking-tighter hover:text-accent transition-colors py-2",
                                                item.isButton && "text-accent"
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Footer Area */}
                        <motion.div
                            variants={itemVariants}
                            className="absolute bottom-12 flex flex-col items-center gap-6"
                        >
                            <div className="w-12 h-1 bg-border rounded-full" />
                            <ThemeToggle />
                            <p className="text-sm text-muted-foreground font-medium">
                                © 2026 TMF Marketplace
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
