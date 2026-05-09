'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=' + window.location.pathname);
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null; // will redirect
    }

    return children;
}