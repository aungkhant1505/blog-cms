import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Navbar />

            {/* The Main Content Area grows to push the footer down */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 py-10 mt-auto">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}