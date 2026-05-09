'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setUser(res.data.user);
                } catch (err) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const register = async (username: string, email: string, password: string) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                { username, email, password }
            );
            localStorage.setItem('accessToken', res.data.tokens.accessToken);
            localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
            setUser(res.data.data);
        } catch (err: any) {
            throw new Error(err.response?.data?.error?.message || 'Registration failed');
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                { email, password }
            );
            localStorage.setItem('accessToken', res.data.tokens.accessToken);
            localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
            setUser(res.data.data);
        } catch (err: any) {
            throw new Error(err.response?.data?.error?.message || 'Login failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
