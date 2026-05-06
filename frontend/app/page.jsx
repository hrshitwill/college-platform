'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar      from '@/components/Navbar';
import CollegeCard from '@/components/Collegescard';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [colleges,  setColleges]  = useState([]);
    const [search,    setSearch]    = useState('');
    const [location,  setLocation]  = useState('');
    const [feesMax,   setFeesMax]   = useState('');
    const [page,      setPage]      = useState(1);
    const [loading,   setLoading]   = useState(false);
    const [compare,   setCompare]   = useState([]);
    const router = useRouter();

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/colleges`,
                { params: { search, location, fees_max: feesMax, page } }
            );
            setColleges(res.data.colleges);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchColleges(); }, [search, location, feesMax, page]);

    const toggleCompare = (college) => {
        setCompare(prev =>
            prev.find(c => c.id === college.id)
                ? prev.filter(c => c.id !== college.id)
                : prev.length < 3
                    ? [...prev, college]
                    : prev
        );
    };

    const goCompare = () => {
        const ids = compare.map(c => c.id).join(',');
        router.push(`/compare?ids=${ids}`);
    };

    return (
        <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-6 py-8">

            {/* Hero */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3">
                    Find Your Dream College 🎓
                </h1>
                <p className="text-gray-500">
                    Search from top colleges across India
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="🔍 Search colleges..."
                    onChange={e => setSearch(e.target.value)}
                    className="w-full border-2 border-gray-200
                               rounded-2xl px-6 py-4 text-lg
                               focus:outline-none focus:border-blue-400"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-8">
                <select
                    onChange={e => setLocation(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl
                               px-4 py-2 focus:outline-none
                               focus:border-blue-400">
                    <option value="">All States</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Telangana">Telangana</option>
                </select>

                <select
                    onChange={e => setFeesMax(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl
                               px-4 py-2 focus:outline-none
                               focus:border-blue-400">
                    <option value="">Any Fees</option>
                    <option value="150000">Under 1.5L</option>
                    <option value="200000">Under 2L</option>
                    <option value="300000">Under 3L</option>
                    <option value="500000">Under 5L</option>
                </select>
            </div>

            {/* College Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">
                    Loading colleges...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2
                                lg:grid-cols-3 gap-6">
                    {colleges.map(college => (
                        <CollegeCard
                            key={college.id}
                            college={college}
                            isSelected={!!compare.find(c => c.id === college.id)}
                            onCompare={toggleCompare}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-10">
                <button
                    onClick={() => setPage(p => Math.max(1, p-1))}
                    disabled={page === 1}
                    className="px-6 py-2 border-2 rounded-xl
                               disabled:opacity-40 hover:border-blue-400">
                    ← Prev
                </button>
                <span className="px-6 py-2 bg-blue-600
                                 text-white rounded-xl">
                    Page {page}
                </span>
                <button
                    onClick={() => setPage(p => p+1)}
                    className="px-6 py-2 border-2 rounded-xl
                               hover:border-blue-400">
                    Next →
                </button>
            </div>
        </main>

        {/* Compare Bar */}
        {compare.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0
                            bg-blue-600 text-white px-6 py-4
                            flex justify-between items-center
                            shadow-lg z-50">
                <div className="flex gap-3">
                    {compare.map(c => (
                        <span key={c.id}
                              className="bg-blue-500 px-3 py-1 rounded-full text-sm">
                            {c.name}
                        </span>
                    ))}
                </div>
                <button
                    onClick={goCompare}
                    className="bg-white text-blue-600 font-bold
                               px-6 py-2 rounded-xl hover:bg-blue-50">
                    Compare Now →
                </button>
            </div>
        )}
        </>
    );
}