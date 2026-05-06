import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm px-6 py-4
                        flex justify-between items-center
                        sticky top-0 z-50">
            <Link href="/"
                  className="text-blue-600 font-bold text-xl">
                🎓 CollegeFinder
            </Link>

            <div className="flex gap-6 text-sm font-medium">
                <Link href="/"
                      className="hover:text-blue-600">
                    Colleges
                </Link>
                <Link href="/compare"
                      className="hover:text-blue-600">
                    Compare
                </Link>
                <Link href="/predictor"
                      className="hover:text-blue-600">
                    Predictor
                </Link>
            </div>
        </nav>
    );
}
