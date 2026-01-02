'use client';

import { motion, Variants } from 'framer-motion';

interface LogoProps {
    loading?: boolean;
    className?: string; // for width/height controls
    color?: string;
}

export const Logo = ({ loading, className = "w-16 h-16", color = "#e3672a" }: LogoProps) => {
    // Path Animation: Draw stroke, then fill
    const pathVariants: Variants = {
        hidden: {
            pathLength: 0,
            fill: "rgba(0,0,0,0)" // generic transparent
        },
        visible: {
            pathLength: 1,
            fill: color,
            transition: {
                pathLength: { duration: 1.5, ease: "easeInOut" },
                fill: { duration: 0.5, delay: 1.5 } // fill in after drawing is done
            }
        },
        loading: {
            pathLength: 1,
            fill: color, // Always visible when loading
        }
    };

    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 258 298"
            className={className}

            // Mount Animation Trigger
            initial="hidden"
            animate={loading ? "loading" : "visible"}

            // Hover Animation (Only if not loading)
            whileHover={!loading ? {
                scale: 1.1,
                filter: `drop-shadow(0 0 8px ${color}80)`, // 50% opacity approximation
                transition: { type: "spring", stiffness: 300 }
            } : {}}

            // Loading State Override
            variants={{
                loading: {
                    scale: [1, 1.1, 1],
                    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                },
                visible: {
                    scale: 1,
                    transition: { duration: 0.5 }
                }
            }}
        >
            {/* Path 1 */}
            <motion.path
                d="M36.004,200.825l0,-106.062l92.138,-53.192l0,-41.571l-128.142,73.975l0,126.85l36.004,0Z"
                stroke={color}
                strokeWidth="2"
                variants={pathVariants}
            />
            {/* Path 2 */}
            <motion.path
                d="M220.51,93.906l1.483,0.858l0,107.383l-92.992,53.683l-0.071,-0.038l0,41.575l0.071,0.033l128.996,-74.463l0,-129.033l-37.488,0Z"
                stroke={color}
                strokeWidth="2"
                variants={pathVariants}
            />
            {/* Path 3 */}
            <motion.path
                d="M64.392,111.154l64.608,-37.296l64.604,37.296l0,74.6l-64.604,37.296l-64.608,-37.296l0,-74.6Z"
                stroke={color}
                strokeWidth="2"
                variants={pathVariants}
            />
        </motion.svg>
    );
};
