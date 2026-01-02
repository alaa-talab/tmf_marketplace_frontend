'use client';

import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/set-state-in-effect
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative h-9 w-16 rounded-full bg-accent/20 border border-accent/30 p-1 cursor-pointer overflow-hidden flex items-center"
            title="Toggle Theme"
        >
            <motion.div
                className="absolute w-7 h-7 bg-background rounded-full shadow-md flex items-center justify-center z-10"
                initial={false}
                animate={{
                    x: isDark ? 28 : 0
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 180 : 0 }}
                >
                    {isDark ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-orange-500" />}
                </motion.div>
            </motion.div>

            {/* Background Icons for "Gravity" feel */}
            <div className="flex justify-between w-full px-1.5 opacity-50 text-xs">
                <Sun className="w-4 h-4 text-orange-500 opacity-50" />
                <Moon className="w-4 h-4 text-blue-400 opacity-50" />
            </div>
        </button>
    );
};
