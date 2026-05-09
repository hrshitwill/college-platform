'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Login() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <>
        <Navbar />
        <main className="max-w-md mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl
                           px-4 py-3 mb-4 focus:outline-none
                           focus:border-blue-400"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl
                           px-4 py-3 mb-6 focus:outline-none
                           focus:border-blue-400"
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3
                           rounded-xl font-bold hover:bg-blue-700
                           disabled:opacity-40">
                {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center mt-4 text-gray-600">
                No account?{' '}
                <Link href="/register" className="text-blue-600 font-bold">
                    Register here
                </Link>
            </p>
        </main>
        </>
    );
}