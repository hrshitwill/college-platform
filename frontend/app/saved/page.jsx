'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import CollegeCard from '@/components/Collegescard';
import { useAuth } from '@/context/AuthContext';

function SavedContent() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading]   = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchSavedColleges();
    }, []);

    const fetchSavedColleges = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/saved-colleges`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setColleges(res.data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const removeCollege = async (collegeId) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/saved-colleges/${collegeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setColleges(prev => prev.filter(c => c.id !== collegeId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-10">
                <Link href="/" className="text-blue-600 text-sm hover:underline">
                    ← Back to Colleges
                </Link>
                <h1 className="text-4xl font-bold mt-3">
                    ❤️ Your Saved Colleges
                </h1>
                <p className="text-gray-500 mt-1">
                    {user?.username}, here are your saved colleges
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    Loading...
                </div>
            ) : colleges.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl
                                border border-gray-100">
                    <p className="text-4xl mb-3">📚</p>
                    <p className="text-gray-500 font-medium mb-4">
                        No saved colleges yet!
                    </p>
                    <Link href="/"
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl">
                        ← Browse Colleges
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2
                                lg:grid-cols-3 gap-6">
                    {colleges.map(college => (
                        <div key={college.id}
                             className="bg-white rounded-2xl shadow-sm
                                        border border-gray-100 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="font-bold text-lg">
                                    {college.name}
                                </h2>
                                <button
                                    onClick={() => removeCollege(college.id)}
                                    className="text-red-500 hover:text-red-700
                                               font-bold text-xl">
                                    ✕
                                </button>
                            </div>

                            <p className="text-gray-500 text-sm mb-4">
                                📍 {college.location}
                            </p>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div className="text-center">
                                    <p className="text-yellow-500 font-bold">
                                        ⭐ {college.rating}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-green-600 font-bold">
                                        {college.placement}%
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-blue-600 font-bold text-sm">
                                        ₹{(college.fees_min/100000).toFixed(1)}L
                                    </p>
                                </div>
                            </div>

                            <Link href={`/college/${college.id}`}
                                  className="block text-center bg-blue-600
                                             text-white py-2 rounded-xl
                                             hover:bg-blue-700 transition">
                                View Details →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default function Saved() {
    return (
        <ProtectedRoute>
            <>
            <Navbar />
            <SavedContent />
            </>
        </ProtectedRoute>
    );
}