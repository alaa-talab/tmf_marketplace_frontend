'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SpotlightInput } from '@/components/ui/spotlight-input';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login({ username, password });
        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to resume your journey."
        >
            <form onSubmit={handleSubmit} className="space-y-6 mt-6 p-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground/80 ml-1">Username</label>
                    <SpotlightInput
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        // Adding CSS var for the spotlight color dynamically
                        // @ts-ignore
                        style={{ "--accent-color": "#e3672a" }}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground/80 ml-1">Password</label>
                    <SpotlightInput
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        // @ts-ignore
                        style={{ "--accent-color": "#e3672a" }}
                    />
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 dark:text-red-400 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center"
                    >
                        {error}
                    </motion.p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base font-semibold bg-[#e3672a] hover:from-blue-500 hover:to-purple-500 border-0 shadow-lg shadow-[#e3672a]/20 transition-all duration-300 transform hover:scale-[1.02]"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Signing in...</span>
                        </div>
                    ) : 'Sign In'}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-accent hover:underline font-semibold">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}
