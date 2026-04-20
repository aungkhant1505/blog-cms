import { BookOpen, UserCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";


export default function Navbar() {
    const location = useLocation();

    // A simple helper to highlight the active link
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                        <BookOpen size={20} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        My<span className="text-blue-600">Blog</span>
                    </span>
                </Link>

                {/* Public Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/blog"
                        className={`text-sm font-semibold transition-colors ${isActive('/blog') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Articles
                    </Link>
                </div>

                {/* Admin Shortcut (Hidden on small screens for a cleaner look) */}
                <div className="flex items-center">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <UserCircle size={20} />
                        <span className="hidden sm:block">Admin</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}