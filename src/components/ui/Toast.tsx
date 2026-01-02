'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastItemProps {
    toast: Toast;
    onDismiss: (id: string) => void;
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
    const [progress, setProgress] = useState(100);
    const duration = toast.duration || 5000;

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => Math.max(0, prev - (100 / duration) * 50));
        }, 50);

        const timeout = setTimeout(() => {
            onDismiss(toast.id);
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [toast.id, duration, onDismiss]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const colors = {
        success: 'border-green-500/20 bg-green-500/10',
        error: 'border-red-500/20 bg-red-500/10',
        warning: 'border-yellow-500/20 bg-yellow-500/10',
        info: 'border-blue-500/20 bg-blue-500/10',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`relative w-full max-w-sm rounded-xl border backdrop-blur-xl shadow-lg overflow-hidden ${colors[toast.type]}`}
        >
            <div className="p-4 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
                <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
                <button
                    onClick={() => onDismiss(toast.id)}
                    className="flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-foreground/10">
                <motion.div
                    className="h-full bg-accent"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.05, ease: 'linear' }}
                />
            </div>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onDismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onDismiss={onDismiss} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
