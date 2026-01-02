'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMotionTemplate, useMotionValue, motion } from 'framer-motion';

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const SpotlightInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        const radius = 100; // Radius of the spotlight
        const [visible, setVisible] = React.useState(false);

        const mouseX = useMotionValue(0);
        const mouseY = useMotionValue(0);

        function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
            const { left, top } = currentTarget.getBoundingClientRect();
            mouseX.set(clientX - left);
            mouseY.set(clientY - top);
        }

        return (
            <motion.div
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              var(--accent-color),
              transparent 80%
            )
          `,
                }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                className="p-[2px] rounded-xl transition duration-300 group/input bg-zinc-200 dark:bg-neutral-800"
            >
                <input
                    type={type}
                    className={cn(
                        "flex h-12 w-full border-none bg-zinc-100 dark:bg-zinc-900/80 text-black dark:text-white shadow-input rounded-xl px-4 py-2 text-sm max-w-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition duration-400 group-hover/input:bg-zinc-50 dark:group-hover/input:bg-black/60",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </motion.div>
        );
    }
);
SpotlightInput.displayName = "SpotlightInput";

export { SpotlightInput };
