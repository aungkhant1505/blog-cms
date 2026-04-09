import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, LogOut, LayoutDashboard, Loader2, FileText } from 'lucide-react';
import api from '../api/axios';


interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    category: Category | null;
}

// Laravel pagination response structure
interface PaginatedResponse {
    data: Post[];
    current_page: number;
    last_page: number;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {data: postsData, isLoading, isError} = useQuery<PaginatedResponse>({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await api.get('/posts');
            return response.data;
        }
    });

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('auth_token');
            navigate('/login');
        }
    };

    const deleteMutation = useMutation({
        mutationFn: async (postId: number) => {
            await api.delete(`/posts/${postId}`);
        },
        onSuccess: () => {
            // This forces TanStack Query to refetch the posts automatically!
            queryClient.invalidateQueries({queryKey: ['posts']});
        }
    })

    const handleDelete = (id: number, title: string) => {
        if (window.confirm(`Are you sure you want to delete the post "${title}"? This action cannot be undone.`)) {
            deleteMutation.mutate(id);
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <LayoutDashboard size={24} className="text-blue-400" />
                        CMS Admin
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl transition-all">
                        <FileText size={20} /> All Posts
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
                            <p className="text-gray-500 mt-1">Manage and publish your blog content.</p>
                        </div>
                        <Link to="/create-post" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98]">
                            <Plus size={20} /> Create New Post
                        </Link>
                    </div>

                    {/* Data Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {isLoading ? (
                            <div className="p-10 flex flex-col items-center justify-center text-gray-500">
                                <Loader2 size={40} className="animate-spin mb-4 text-blue-500" />
                                <p>Loading your content...</p>
                            </div>
                        ) : isError ? (
                            <div className="p-10 text-center text-red-500">
                                Failed to load posts. Please check your connection.
                            </div>
                        ) : postsData?.data.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-6">Get started by writing your first blog post.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {postsData?.data.map((post) => (
                                        <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-5 font-semibold text-gray-900">{post.title}</td>
                                            <td className="p-5 text-gray-600">
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                                    {post.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                {post.is_published ? (
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Published</span>
                                                ) : (
                                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">Draft</span>
                                                )}
                                            </td>
                                            <td className="p-5 text-gray-500 text-sm">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        to={`/edit-post/${post.id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                                                            <Edit size={18} />
                                                    </Link>
                                                    <button onClick={() => handleDelete(post.id, post.title)} disabled={deleteMutation.isPending}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        {deleteMutation.isPending ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}