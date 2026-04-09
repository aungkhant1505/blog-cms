import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../api/axios";
import { useState } from "react";
import { AlignLeft, ArrowLeft, Folder, LinkIcon, Loader2, Save, Type } from "lucide-react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    id: number;
    name: string;
}

interface PostVariables {
    title: string;
    content: string;
    slug: string;
    category_id: number | '';
    is_published: boolean;
}

const editorModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
    ],
};

export const EditPost = () => {
    const { id } = useParams(); // Gets the post ID from the URL
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [isPublished, setIsPublished] = useState(false);

    // Fetch the specific post data to pre-fill the form
    const { isLoading: loadingPost } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const response = await api.get(`/posts/${id}`);
            const post = response.data;

            setTitle(post.title);
            setContent(post.content);
            setSlug(post.slug);
            setCategoryId(post.category_id);
            setIsPublished(post.is_published);

            return post;
        },
        // We don't want to re-fetch and overwrite user edits if they switch tabs
        staleTime: Infinity,
    })

    // Fetch Categories for the dropdown
    const { data: categories, isLoading: loadingCategories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api.get('/categories');
            return response.data;
        }
    })

    const updatePostMutation = useMutation<any, Error, PostVariables>({
        mutationFn: async (updatedPost) => {
            const response = await api.put(`/posts/${id}`, updatedPost);
            return response.data;
        },
        onSuccess: () => navigate('/dashboard')
    })

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (categoryId === '') return;

        updatePostMutation.mutate({
            title,
            content,
            slug,
            category_id: categoryId,
            is_published: isPublished,
        });
    }

    if (loadingPost) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 size={40} className="animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                            <ArrowLeft size={20} className="text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
                    </div>
                </div>

                {updatePostMutation.isError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium">
                        Failed to update post. Please try again.
                    </div>
                )}

                {/* Form matches the Create screen exactly! */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <Type size={16} className="text-blue-500" /> Title
                            </label>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-lg font-semibold bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <LinkIcon size={16} className="text-blue-500" /> URL Slug
                            </label>
                            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full text-lg bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                                <Folder size={16} className="text-blue-500" /> Category
                            </label>
                            <select required value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full text-lg bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="" disabled>Select a category...</option>
                                {loadingCategories ? <option disabled>Loading...</option> : categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>

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

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase mb-3">
                            <AlignLeft size={16} className="text-blue-500" /> Content
                        </label>
                        <div className="h-72 mb-12">
                            <ReactQuill 
                                theme="snow" 
                                value={content} 
                                onChange={setContent} 
                                modules={editorModules}
                                className="h-full bg-white rounded-b-xl"
                                placeholder="Edit your masterpiece here..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" disabled={updatePostMutation.isPending || categoryId === ''} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-60">
                            {updatePostMutation.isPending ? <><Loader2 className="animate-spin" size={20} /> Updating...</> : <><Save size={20} /> Update Post</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
