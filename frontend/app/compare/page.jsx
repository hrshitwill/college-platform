'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Compare() {
    const searchParams = useSearchParams();
    const [colleges,  setColleges]  = useState([]);
    const [loading,   setLoading]   = useState(false);

    useEffect(() => {
        const ids = searchParams.get('ids');
        if (ids) fetchCompare(ids.split(','));
    }, []);

    const fetchCompare = async (ids) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/colleges/compare`,
                { ids }
            );
            setColleges(res.data.colleges);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const fields = [
        { label: '📍 Location',   key: 'location' },
        { label: '🏛️ State',      key: 'state' },
        { label: '🏷️ Type',       key: 'type' },
        { label: '📅 Established',key: 'established' },
        { label: '⭐ Rating',     key: 'rating' },
        { label: '🎯 Placement',  key: 'placement',
          format: v => `${v}%` },
        { label: '💰 Min Fees',   key: 'fees_min',
          format: v => `₹${(v/100000).toFixed(1)}L/yr` },
        { label: '💰 Max Fees',   key: 'fees_max',
          format: v => `₹${(v/100000).toFixed(1)}L/yr` },
    ];

    // highlight best value
    const getBest = (key) => {
        if (!colleges.length) return null;
        if (key === 'rating' || key === 'placement')
            return Math.max(...colleges.map(c => c[key]));
        if (key === 'fees_min' || key === 'fees_max')
            return Math.min(...colleges.map(c => c[key]));
        return null;
    };

    return (
        <>
        <Navbar />
        <main className="max-w-6xl mx-auto px-6 py-8">

            {/* Header */}
            <div className="mb-8">
                <Link href="/"
                      className="text-blue-600 text-sm hover:underline">
                    ← Back to Colleges
                </Link>
                <h1 className="text-3xl font-bold mt-3">
                    Compare Colleges ⚖️
                </h1>
                <p className="text-gray-500 mt-1">
                    Select colleges from listing page to compare
                </p>
            </div>

            {loading && (
                <div className="text-center py-20 text-gray-400">
                    Loading comparison...
                </div>
            )}

            {!loading && colleges.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg mb-4">
                        No colleges selected!
                    </p>
                    <Link href="/"
                          className="bg-blue-600 text-white
                                     px-6 py-3 rounded-xl">
                        ← Go Select Colleges
                    </Link>
                </div>
            )}

            {colleges.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm
                                border border-gray-100 overflow-hidden">
                    <table className="w-full">

                        {/* College Names Header */}
                        <thead>
                            <tr className="border-b">
                                <th className="p-6 text-left bg-gray-50
                                               text-gray-500 font-medium w-40">
                                    Feature
                                </th>
                                {colleges.map(c => (
                                    <th key={c.id}
                                        className="p-6 text-left">
                                        <div className="bg-gradient-to-r
                                                        from-blue-500 to-indigo-600
                                                        rounded-xl p-4 text-white">
                                            <p className="font-bold text-lg">
                                                {c.name}
                                            </p>
                                            <p className="text-blue-100 text-sm mt-1">
                                                📍 {c.location}
                                            </p>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* Comparison Rows */}
                        <tbody>
                            {fields.map((field, i) => {
                                const best = getBest(field.key);
                                return (
                                    <tr key={field.label}
                                        className={i % 2 === 0
                                            ? 'bg-white'
                                            : 'bg-gray-50'}>
                                        <td className="p-4 font-medium
                                                       text-gray-600 text-sm">
                                            {field.label}
                                        </td>
                                        {colleges.map(c => {
                                            const val = c[field.key];
                                            const isBest = best !== null
                                                && val === best;
                                            return (
                                                <td key={c.id}
                                                    className="p-4">
                                                    <span className={`
                                                        font-medium
                                                        ${isBest
                                                            ? 'text-green-600 font-bold'
                                                            : 'text-gray-700'}
                                                    `}>
                                                        {field.format
                                                            ? field.format(val)
                                                            : val}
                                                        {isBest && (
                                                            <span className="ml-2
                                                                text-xs bg-green-100
                                                                text-green-600
                                                                px-2 py-0.5
                                                                rounded-full">
                                                                Best ✅
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
        </>
    );
}