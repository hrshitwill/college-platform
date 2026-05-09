'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!username || !email || !password) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await register(username, email, password);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <>
        <Navbar />
        <main className="max-w-md mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl
                           px-4 py-3 mb-4 focus:outline-none
                           focus:border-blue-400"
            />

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
                placeholder="Password (min 6 chars)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl
                           px-4 py-3 mb-6 focus:outline-none
                           focus:border-blue-400"
            />

            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3
                           rounded-xl font-bold hover:bg-blue-700
                           disabled:opacity-40">
                {loading ? 'Registering...' : 'Register'}
            </button>

            <p className="text-center mt-4 text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 font-bold">
                    Login here
                </Link>
            </p>
        </main>
        </>
    );
}