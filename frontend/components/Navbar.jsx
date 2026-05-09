'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="bg-white shadow-sm px-6 py-4
                        flex justify-between items-center
                        sticky top-0 z-50">
            <Link href="/"
                  className="text-blue-600 font-bold text-xl">
                🎓 CollegeFinder
            </Link>

            <div className="flex gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-blue-600">
                    Colleges
                </Link>
                
                {user ? (
                    <>
                    <Link href="/compare" className="hover:text-blue-600">
                        Compare
                    </Link>
                    <Link href="/predictor" className="hover:text-blue-600">
                        Predictor
                    </Link>
                    <Link href="/saved" className="text-red-500 hover:text-red-600">
                        ❤️ Saved
                    </Link>
                    </>
                ) : (
                    <>
                    <span className="text-gray-300 cursor-not-allowed">
                        Compare
                    </span>
                    <span className="text-gray-300 cursor-not-allowed">
                        Predictor
                    </span>
                    </>
                )}
            </div>

            <div className="flex gap-3">
                {user ? (
                    <>
                    <span className="px-3 py-1 bg-blue-50
                                     text-blue-600 rounded-lg text-sm">
                        {user.username}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700
                                   font-medium">
                        Logout
                    </button>
                    </>
                ) : (
                    <>
                    <Link href="/login"
                          className="text-blue-600 hover:text-blue-700">
                        Login
                    </Link>
                    <Link href="/register"
                          className="bg-blue-600 text-white
                                     px-4 py-1 rounded-lg">
                        Register
                    </Link>
                    </>
                )}
            </div>
        </nav>
    );
}