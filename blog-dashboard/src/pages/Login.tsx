import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Lock, Mail, Loader2 } from 'lucide-react';
import api from '../api/axios'; // Keep axios for the actual call

interface LoginVariables {
    email: string;
    password: string;
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // The Mutation: Handles the logic and state
    const loginMutation = useMutation<any, Error, LoginVariables>({
        mutationFn: async (credentials) => {
            const response = await api.post('/login', credentials);
            return response.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('auth_token', data.token);
            navigate('/dashboard');
        },
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                {/* ... UI Header ... */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600 rounded-xl text-white mb-4">
                        <Lock size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage your blog</p>
                </div>

                {loginMutation.isError && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                        Invalid credentials. Please try again.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ... Input Fields ... */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input 
                                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loginMutation.isPending}
                        className="w-full bg-blue-600 flex justify-center items-center gap-2 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-70 transition-all"
                    >
                        {loginMutation.isPending ? (
                            <> <Loader2 className="animate-spin" size={20} /> Signing in... </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}