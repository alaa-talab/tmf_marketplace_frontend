'use client';

import { cn } from '@/lib/utils';

interface InfiniteMarqueeProps {
    items: string[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    className?: string;
}

export const InfiniteMarquee = ({
    items,
    direction = 'left',
    speed = 'normal',
    className
}: InfiniteMarqueeProps) => {

    const animationDuration = {
        fast: '20s',
        normal: '40s',
        slow: '60s',
    }[speed];

    return (
        <div className={cn("relative flex overflow-hidden w-full select-none bg-white dark:bg-background", className)}>
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-white dark:from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-white dark:from-background to-transparent pointer-events-none" />

            <div
                className={cn(
                    "flex min-w-full shrink-0 gap-8 py-4 px-4",
                    direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
                )}
                style={{ animationDuration }}
            >
                {[...items, ...items, ...items].map((item, idx) => (
                    <span
                        key={idx}
                        className="text-2xl md:text-4xl font-bold font-sans tracking-tighter text-muted-foreground/40 whitespace-nowrap uppercase"
                    >
                        {item}
                    </span>
                ))}
            </div>

            {/* Duplicate for seamless loop if needed by CSS animation (tailwind config might need update for keyframes) */}
            <div
                className={cn(
                    "flex min-w-full shrink-0 gap-8 py-4 px-4",
                    direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'
                )}
                aria-hidden="true"
                style={{ animationDuration }}
            >
                {[...items, ...items, ...items].map((item, idx) => (
                    <span
                        key={idx}
                        className="text-2xl md:text-4xl font-bold font-sans tracking-tighter text-muted-foreground/40 whitespace-nowrap uppercase"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};
