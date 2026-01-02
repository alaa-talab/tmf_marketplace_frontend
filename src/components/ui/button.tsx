'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Combine HTML button attributes with Motion props to avoid conflicts
type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    children: React.ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const Button = ({ children, variant = 'primary', className, onClick, ...props }: ButtonProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        // Magnetic pull calculation
        const x = (clientX - (left + width / 2)) * 0.35;
        const y = (clientY - (top + height / 2)) * 0.35;

        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    const baseStyles = "relative px-6 py-3 rounded-full font-medium text-sm transition-colors duration-300 overflow-hidden flex items-center justify-center group";

    const variants = {
        primary: "bg-[#E3672A] text-white hover:bg-[#d0561b]",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent/10 hover:text-accent",
    };

    return (
        <motion.button
            ref={ref}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={cn(baseStyles, variants[variant], className)}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props as any)}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>

            {variant === 'outline' && (
                <span className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-10 transition-opacity duration-300 ease-out" />
            )}
        </motion.button>
    );
};
