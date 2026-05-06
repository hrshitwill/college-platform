import Link from 'next/link';

export default function CollegeCard({ college, isSelected, onCompare }) {
    return (
        <div className={`bg-white rounded-2xl shadow-sm
                        border-2 transition-all hover:shadow-md
                        ${isSelected
                            ? 'border-blue-500'
                            : 'border-transparent'}`}>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500
                            to-indigo-600 rounded-t-2xl p-6">
                <h2 className="text-white font-bold text-lg">
                    {college.name}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                    📍 {college.location}, {college.state}
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b">
                <div className="text-center">
                    <p className="text-yellow-500 font-bold">
                        ⭐ {college.rating}
                    </p>
                    <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                    <p className="text-green-600 font-bold">
                        {college.placement}%
                    </p>
                    <p className="text-xs text-gray-400">Placement</p>
                </div>
                <div className="text-center">
                    <p className="text-blue-600 font-bold text-sm">
                        ₹{(college.fees_min/100000).toFixed(1)}L
                    </p>
                    <p className="text-xs text-gray-400">Fees/yr</p>
                </div>
            </div>

            {/* Type */}
            <div className="px-4 py-2">
                <span className={`text-xs px-2 py-1 rounded-full
                    ${college.type === 'Government'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'}`}>
                    {college.type}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                    Est. {college.established}
                </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 p-4 pt-2">
                <Link href={`/college/${college.id}`}
                      className="flex-1 text-center bg-blue-600
                                 text-white py-2 rounded-xl text-sm
                                 hover:bg-blue-700 transition">
                    View Details
                </Link>
                <button
                    onClick={() => onCompare(college)}
                    className={`flex-1 py-2 rounded-xl text-sm
                               border-2 transition
                               ${isSelected
                                   ? 'bg-blue-50 border-blue-500 text-blue-600'
                                   : 'border-gray-200 hover:border-blue-300'}`}>
                    {isSelected ? '✅ Added' : '+ Compare'}
                </button>
            </div>
        </div>
    );
}