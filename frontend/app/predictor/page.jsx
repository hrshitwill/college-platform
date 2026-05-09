'use client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

function PredictorContent() {
    const [exam,     setExam]     = useState('JEE');
    const [rank,     setRank]     = useState('');
    const [colleges, setColleges] = useState([]);
    const [loading,  setLoading]  = useState(false);
    const [searched, setSearched] = useState(false);

    const predict = async () => {
        if (!rank) return;
        setLoading(true);
        setSearched(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/predictor`,
                { exam, rank: Number(rank) }
            );
            setColleges(res.data.colleges);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <main className="max-w-3xl mx-auto px-6 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3">
                    College Predictor 🧠
                </h1>
                <p className="text-gray-500">
                    Enter your exam and rank to find
                    colleges you can get into!
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm
                            border border-gray-100 p-8 mb-8">
                <div className="mb-6">
                    <label className="block text-sm font-medium
                                      text-gray-700 mb-2">
                        Select Exam
                    </label>
                    <div className="flex gap-3">
                        {['JEE', 'NEET', 'CAT'].map(e => (
                            <button
                                key={e}
                                onClick={() => setExam(e)}
                                className={`flex-1 py-3 rounded-xl
                                           font-medium border-2 transition
                                           ${exam === e
                                               ? 'bg-blue-600 text-white border-blue-600'
                                               : 'border-gray-200 hover:border-blue-300'
                                           }`}>
                                {e}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium
                                      text-gray-700 mb-2">
                        Your Rank
                    </label>
                    <input
                        type="number"
                        value={rank}
                        onChange={e => setRank(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && predict()}
                        placeholder="e.g. 1500"
                        className="w-full border-2 border-gray-200
                                   rounded-xl px-4 py-3 text-lg
                                   focus:outline-none focus:border-blue-400"
                    />
                </div>

                <button
                    onClick={predict}
                    disabled={!rank || loading}
                    className="w-full bg-blue-600 text-white
                               py-4 rounded-xl font-bold text-lg
                               hover:bg-blue-700 transition
                               disabled:opacity-40">
                    {loading ? 'Finding Colleges...' : '🔍 Predict Colleges'}
                </button>
            </div>

            {searched && !loading && (
                <>
                {colleges.length === 0 ? (
                    <div className="text-center py-10 bg-white
                                    rounded-2xl border border-gray-100">
                        <p className="text-4xl mb-3">😔</p>
                        <p className="text-gray-500 font-medium">
                            No colleges found for rank {rank}
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Try a different rank or exam
                        </p>
                    </div>
                ) : (
                    <>
                    <div className="flex justify-between
                                    items-center mb-4">
                        <h2 className="font-bold text-lg">
                            {colleges.length} Colleges Found 🎉
                        </h2>
                        <span className="text-sm text-gray-400">
                            {exam} Rank: {Number(rank).toLocaleString()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {colleges.map((college, i) => (
                            <div key={college.id}
                                 className="bg-white rounded-2xl
                                            border border-gray-100
                                            shadow-sm p-6
                                            flex justify-between
                                            items-center hover:shadow-md
                                            transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100
                                                    text-blue-600 rounded-full
                                                    flex items-center
                                                    justify-center font-bold">
                                        {i+1}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {college.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            📍 {college.location}
                                        </p>
                                        <p className="text-green-600
                                                      text-xs mt-1 font-medium">
                                            ✅ Rank Range: {college.rank_min?.toLocaleString()}
                                            {' – '}
                                            {college.rank_max?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex gap-3 mb-3
                                                    justify-end text-sm">
                                        <span className="bg-yellow-50
                                                         text-yellow-600
                                                         px-2 py-1 rounded-lg">
                                            ⭐ {college.rating}
                                        </span>
                                        <span className="bg-green-50
                                                         text-green-600
                                                         px-2 py-1 rounded-lg">
                                            🎯 {college.placement}%
                                        </span>
                                    </div>
                                    <Link
                                        href={`/college/${college.id}`}
                                        className="bg-blue-600 text-white
                                                   px-4 py-2 rounded-xl
                                                   text-sm hover:bg-blue-700
                                                   transition">
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    </>
                )}
                </>
            )}
        </main>
    );
}

export default function Predictor() {
    return (
        <ProtectedRoute>
            <>
            <Navbar />
            <PredictorContent />
            </>
        </ProtectedRoute>
    );
}