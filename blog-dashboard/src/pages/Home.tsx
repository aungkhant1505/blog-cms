import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Home() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            
            <SEO title='Home' description='Welcome to the future of content management!' />

            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Welcome to the <span className="text-blue-600">Future of Content</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                This is the public face of your headless CMS. It's fast, modern, and completely disconnected from the backend.
            </p>
            <Link to="/blog" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-200">
                Read the Blog
            </Link>
        </div>
    );
}