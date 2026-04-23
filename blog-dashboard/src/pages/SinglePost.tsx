import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { AlertCircle, ArrowLeft, Calendar, Loader2 } from "lucide-react";
import SEO from "../components/SEO";

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
    category: Category | null;
}

const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

export default function SinglePost() {

    const { slug } = useParams();

    const { data: post, isLoading, isError } = useQuery<Post>({
        queryKey: ['post', slug],
        queryFn: async () => {
            const response = await api.get(`/posts/slug/${slug}`)
            return response.data;
        }
    })

    // Create a clean, 150-character excerpt for Google
    const seoDescription = post ? stripHtml(post.content).substring(0, 150) + '...' : '';

    // FIX: Add a temporary SEO tag to the Loading State
    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-blue-600">
                <SEO title="Loading Article..." description="Please wait while we fetch this post." />
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-medium text-gray-500">Loading article...</p>
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
                <SEO title="Post Not Found" description="This article could not be found." />
                <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg">
                    <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
                    <p className="text-gray-500 mb-6">This post may have been removed or is not published yet.</p>
                    <Link to="/blog" className="text-blue-600 font-bold hover:underline">
                        &larr; Back to all articles
                    </Link>
                </div>
            </div>
        );
    }

    // if (isError || !post) {
    //     return (
    //         <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
    //             <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm text-center max-w-lg">
    //                 <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
    //                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
    //                 <p className="text-gray-500 mb-6">This post may have been removed or is not published yet.</p>
    //                 <Link to="/blog" className="text-blue-600 font-bold hover:underline">
    //                     &larr; Back to all articles
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            {post && (
                <SEO
                    title={post.title}
                    description={seoDescription}
                    type="article"
                />
            )}

            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-10 transition-colors">
                <ArrowLeft size={20} /> Back to Articles
            </Link>

            {/* Header Section */}
            <header className="mb-12 border-b border-gray-100 pb-12">
                <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider rounded-full">
                        {post.category?.name || 'Uncategorized'}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500 font-medium">
                        <Calendar size={18} />
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric'
                        })}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                    {post.title}
                </h1>
            </header>

            {/* Content Section
                The 'prose' and 'prose-blue' classes are the magic from Tailwind Typography.
                They automatically style everything inside the raw HTML string.
            */}
            <div
                className="prose prose-lg prose-blue max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
    );
}