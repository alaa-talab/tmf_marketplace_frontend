'use client';

import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/logo';

export const LoadingScreen = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-3xl"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"
                />
                <Logo loading className="w-24 h-24 text-accent" />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-4 text-sm font-medium tracking-widest uppercase text-muted-foreground"
                >
                    Loading TMF...
                </motion.p>
            </div>
        </motion.div>
    );
};
