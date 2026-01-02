'use client';

'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { cn } from '@/lib/utils';
import { Camera, ShoppingBag, ArrowRight } from 'lucide-react';
import { SpotlightInput } from '@/components/ui/spotlight-input';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [role, setRole] = useState<'Uploader' | 'Buyer'>('Buyer');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await register({ ...formData, role });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.username?.[0] || 'Registration failed. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join the premier marketplace for creatives."
        >
            <div className="space-y-6 mt-2">

                {/* Creative Role Toggle - Slide & Glow */}
                <div className="relative grid grid-cols-2 gap-4 p-1 rounded-2xl bg-black/40 border border-white/5">
                    <button
                        type="button"
                        onClick={() => setRole('Buyer')}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 overflow-hidden group",
                            role === 'Buyer'
                                ? "text-white dark:text-white"
                                : "text-muted-foreground hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                        )}
                    >
                        {role === 'Buyer' && (
                            <motion.div
                                layoutId="activeRole"
                                className="absolute inset-0 bg-accent/20 border border-accent/50 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex flex-col items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-semibold text-xs uppercase tracking-wider">Buyer</span>
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setRole('Uploader')}
                        className={cn(
                            "relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 overflow-hidden group",
                            role === 'Uploader'
                                ? "text-white"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {role === 'Uploader' && (
                            <motion.div
                                layoutId="activeRole"
                                className="absolute inset-0 bg-accent/20 border border-accent/50 rounded-xl"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex flex-col items-center gap-2">
                            <Camera className="w-5 h-5" />
                            <span className="font-semibold text-xs uppercase tracking-wider">Creator</span>
                        </span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Username</label>
                        <SpotlightInput
                            type="text"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            placeholder="johndoe"
                            // @ts-ignore
                            style={{ "--accent-color": "#10b981" }}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
                        <SpotlightInput
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            // @ts-ignore
                            style={{ "--accent-color": "#e3672a" }}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
                        <SpotlightInput
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            // @ts-ignore
                            style={{ "--accent-color": "#e3672a" }}
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-400 text-xs font-bold uppercase tracking-wide bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-base font-bold tracking-tight bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 border-0 shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-[1.01] mt-4"
                    >
                        {isLoading ? 'Creating...' : (
                            <span className="flex items-center gap-2">
                                Start Journey <ArrowRight className="w-4 h-4" />
                            </span>
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already a member?{' '}
                    <Link href="/auth/login" className="text-black dark:text-white hover:text-accent transition-colors font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
