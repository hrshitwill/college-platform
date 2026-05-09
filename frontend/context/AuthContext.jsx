'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user,      setUser]      = useState(null);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        // Check if logged in
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setUser(res.data.data);
        } catch (err) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
            { email, password }
        );
        localStorage.setItem('accessToken',  res.data.tokens.accessToken);
        localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        setUser(res.data.data);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
            { username, email, password }
        );
        localStorage.setItem('accessToken',  res.data.tokens.accessToken);
        localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        setUser(res.data.data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, loading, login, register, logout
        }}>
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