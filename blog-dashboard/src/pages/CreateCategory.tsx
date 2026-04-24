import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/axios';

// 1. Define the exact shape of your expected API response
interface Category {
    id: number;
    name: string;
    slug: string;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    message: string;
    category: Category;
}

// 2. Define our local component states
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function CreateCategory() {
    const [name, setName] = useState<string>('');
    const [slug, setSlug] = useState<string>('');
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Auto-generate a URL-friendly slug when the name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        setSlug(newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));

        // Clear any previous errors when the user starts typing again
        if (status === 'error') {
            setStatus('idle');
            setErrorMessage(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage(null);

        try {
            const response = await api.post<ApiResponse>(
                '/categories',
                { name, slug },
                {
                    headers: {
                        'x-gateway-secret': import.meta.env.VITE_GATEWAY_SECRET,
                    }
                }
            );

            setStatus('success');
            setName('');
            setSlug('');

        } catch (error) {
            setStatus('error');

            // Handle Laravel's specific 422 Validation Errors
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                // Grab the first validation error message Laravel sends back
                const validationErrors = error.response.data.errors;
                const firstErrorKey = Object.keys(validationErrors)[0];
                setErrorMessage(validationErrors[firstErrorKey][0]);
            } else {
                setErrorMessage('An unexpected error occurred while communicating with the gateway.');
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Category</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={handleNameChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="e.g., Web Development"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                    <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2 border"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {status === 'submitting' ? 'Saving...' : 'Create Category'}
                </button>

                {status === 'success' && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md border border-green-200 text-sm">
                        Category created successfully!
                    </div>
                )}

                {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                        {errorMessage}
                    </div>
                )}
            </form>
        </div>
    );
}