import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save, ArrowLeft, Loader2, Type, AlignLeft, Folder, Link as LinkIcon } from 'lucide-react';
import api from '../api/axios';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface PostVariables {
    title: string;
    slug: string;
    content: string;
    category_id: number | '';
    is_published: boolean;
}

export const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [isPublished, setIsPublished] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const generatedSlug = title.toLowerCase()
            .trim()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setSlug(generatedSlug);
    }, [title]);

    const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        }
    })

    const createPostMutation = useMutation<any, Error, PostVariables>({
        mutationFn: async (newPost) => {
            const response = await api.post('/posts', newPost);
            return response.data;
        },
        onSuccess: () => {
            navigate('/dashboard');
        }
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Safety check to ensure categoryId is a number before submitting
        if (categoryId === '') return;

        createPostMutation.mutate({ 
            title, 
            slug, 
            content, 
            category_id: categoryId, 
            is_published: isPublished 
        });
    };

  return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Write a New Post</h1>
                    </div>
                </div>

                {createPostMutation.isError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                        Failed to save post. Please check all fields and try again.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <Type size={16} className="text-blue-500" /> Title
                            </label>
                            <input 
                                type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-lg font-semibold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:font-normal"
                                placeholder="Post Title"
                            />
                        </div>

                        {/* Slug */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <LinkIcon size={16} className="text-blue-500" /> URL Slug
                            </label>
                            <input 
                                type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                                className="w-full text-lg bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="post-title-slug"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Dropdown */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <Folder size={16} className="text-blue-500" /> Category
                            </label>
                            <select 
                                required 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(Number(e.target.value))}
                                className="w-full text-lg bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="" disabled>Select a category...</option>
                                {loadingCategories ? (
                                    <option disabled>Loading...</option>
                                ) : (
                                    categories?.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        {/* Publish Toggle */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <label className="text-sm font-bold text-gray-700 uppercase block mb-1">Publish Status</label>
                                <span className="text-sm text-gray-500">Make visible to the public</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                            <AlignLeft size={16} className="text-blue-500" /> Content
                        </label>
                        <textarea 
                            required value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                            placeholder="Write your masterpiece here..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            disabled={createPostMutation.isPending || categoryId === ''} 
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {createPostMutation.isPending ? (
                                <> <Loader2 className="animate-spin" size={20} /> Saving... </>
                            ) : (
                                <> <Save size={20} /> Publish Post </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
