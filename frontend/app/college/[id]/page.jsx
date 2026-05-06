'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function CollegeDetail() {
    const { id } = useParams();
    const [college, setCollege] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/colleges/${id}`
                );
                setCollege(res.data.college);
                setCourses(res.data.courses);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetch();
    }, [id]);

    if (loading) return (
        <>
        <Navbar />
        <div className="text-center py-20 text-gray-400">
            Loading...
        </div>
        </>
    );

    if (!college) return (
        <>
        <Navbar />
        <div className="text-center py-20 text-gray-400">
            College not found!
        </div>
        </>
    );

    return (
        <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-8">

            {/* Back Button */}
            <Link href="/"
                  className="text-blue-600 text-sm mb-6 block
                             hover:underline">
                ← Back to Colleges
            </Link>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500
                            to-indigo-600 rounded-2xl p-8 text-white mb-6">
                <h1 className="text-3xl font-bold">{college.name}</h1>
                <p className="text-blue-100 mt-2">
                    📍 {college.location}, {college.state}
                </p>
                <div className="flex gap-4 mt-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        {college.type}
                    </span>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        Est. {college.established}
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Rating',    value: `⭐ ${college.rating}`,          bg: 'bg-yellow-50' },
                    { label: 'Placement', value: `🎯 ${college.placement}%`,       bg: 'bg-green-50'  },
                    { label: 'Min Fees',  value: `💰 ₹${(college.fees_min/100000).toFixed(1)}L`, bg: 'bg-blue-50'   },
                    { label: 'Max Fees',  value: `💰 ₹${(college.fees_max/100000).toFixed(1)}L`, bg: 'bg-purple-50' },
                ].map(item => (
                    <div key={item.label}
                         className={`${item.bg} rounded-2xl p-4 text-center`}>
                        <p className="text-xl font-bold">{item.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-2xl shadow-sm
                            border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold">📚 Courses Offered</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left text-gray-500
                                           font-medium text-sm">Course</th>
                            <th className="p-4 text-left text-gray-500
                                           font-medium text-sm">Duration</th>
                            <th className="p-4 text-left text-gray-500
                                           font-medium text-sm">Fees/Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? courses.map((course, i) => (
                            <tr key={course.id}
                                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="p-4 font-medium">{course.name}</td>
                                <td className="p-4 text-gray-500">{course.duration}</td>
                                <td className="p-4 text-blue-600 font-medium">
                                    ₹{course.fees?.toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3}
                                    className="p-4 text-center text-gray-400">
                                    No courses found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Placement Section */}
            <div className="bg-white rounded-2xl shadow-sm
                            border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">🎯 Placement Stats</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{ width: `${college.placement}%` }}
                        />
                    </div>
                    <span className="font-bold text-green-600 text-lg">
                        {college.placement}%
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-3">
                    Overall placement rate for 2024 batch
                </p>
            </div>

        </main>
        </>
    );
}