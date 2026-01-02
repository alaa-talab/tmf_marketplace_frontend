'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Logo } from '@/components/ui/logo';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('Uploader' | 'Buyer')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth/login');
            } else if (allowedRoles && !allowedRoles.includes(user.role)) {
                // Redirect to their appropriate dashboard if they try to access a wrong route
                if (user.role === 'Uploader') router.push('/dashboard');
                else router.push('/gallery');
            }
        }
    }, [user, loading, router, allowedRoles]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Logo loading className="w-24 h-24" />
            </div>
        );
    }

    // Double check to prevent flash of content
    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
