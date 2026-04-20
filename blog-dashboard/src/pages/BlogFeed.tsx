import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { ArrowRight, BookOpen, Calendar, Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    is_published: boolean;
    created_at: string;
    category: Category | null;
}

interface PaginatedResponse {
    data: Post[];
}

const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

export default function BlogFeed() {

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const { data: postsData, isLoading: loadingPosts, isError } = useQuery<PaginatedResponse>({
        queryKey: ['public-posts'],
        queryFn: async () => {
            const response = await api.get('/posts');
            return response.data;
        }
    });

    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        }
    });

    const publishedPosts = postsData?.data.filter(post => post.is_published) || [];

    const displayedPosts = selectedCategory
        ? publishedPosts.filter(post => post.category?.id === selectedCategory)
        : publishedPosts;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                    Latest Articles
                </h1>
                <p className="text-lg text-gray-500">
                    Thoughts, tutorials, and updates from the developer desk.
                </p>
            </div>

            {/* Category Filter Bar */}
            {!loadingPosts && publishedPosts.length > 0 && (
                <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    <div className="flex items-center gap-2 text-gray-400 font-medium mr-2">
                        <Filter size={18} />
                    </div>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === null
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        All Posts
                    </button>
                    {categories?.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === category.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Loading State */}
            {loadingPosts && (
                <div className="flex flex-col items-center justify-center py-20 text-blue-600">
                    <Loader2 size={48} className="animate-spin mb-4" />
                    <p className="font-medium text-gray-500">Loading articles...</p>
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center font-medium">
                    Failed to load the blog feed. Please check your connection.
                </div>
            )}

            {/* Empty State (If a category has no posts) */}
            {!loadingPosts && displayedPosts.length === 0 && !isError && (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-500">There are no published posts in this category yet.</p>
                </div>
            )}

            {/* The Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post) => (
                    <Link
                        to={`/post/${post.slug}`}
                        key={post.id}
                        className="group flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className="p-8 flex-grow flex flex-col">
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
                                    {post.category?.name || 'Uncategorized'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 line-clamp-3 mb-6 flex-grow">
                                {stripHtml(post.content)}
                            </p>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                                    <Calendar size={16} />
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                    })}
                                </div>
                                <span className="flex items-center gap-1 text-sm font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                    Read <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}