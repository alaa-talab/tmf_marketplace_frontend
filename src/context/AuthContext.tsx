'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    username: string;
    email: string;
    role: 'Uploader' | 'Buyer';
}

// Define types for credentials/data
interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    role: 'Uploader' | 'Buyer';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = () => {
            const token = Cookies.get('access_token');
            if (token) {
                const storedRole = Cookies.get('user_role') as 'Uploader' | 'Buyer';
                const storedUser = Cookies.get('username');

                if (storedRole && storedUser) {
                    setUser({ username: storedUser, email: '', role: storedRole });
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await api.post('/auth/login/', credentials);
            const { access, refresh } = response.data;

            Cookies.set('access_token', access);
            Cookies.set('refresh_token', refresh);

            // Decode payload to get role
            const payload = JSON.parse(atob(access.split('.')[1]));
            const role = payload.role || 'Buyer';

            Cookies.set('user_role', role);
            Cookies.set('username', payload.username || credentials.username);

            setUser({ username: credentials.username, email: '', role: role });

            if (role === 'Uploader') router.push('/dashboard');
            else router.push('/gallery');

        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        await api.post('/auth/register/', data);
        router.push('/auth/login');
    };

    const logout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('user_role');
        Cookies.remove('username');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
