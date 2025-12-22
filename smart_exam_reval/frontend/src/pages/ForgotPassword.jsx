import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase'; // ✅ Use Supabase directly

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            // ✅ Send Reset Link via Supabase
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setStatus('success');
            setMessage('If an account exists for this email, you will receive a password reset link.');
        } catch (err) {
            setStatus('error');
            setMessage(err.message || "Failed to send reset link.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
                >
                    <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                    </Link>

                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your inbox</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
                            <Link to="/login" className="block w-full py-3 px-4 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-all text-center">
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Enter your email and we'll send you instructions to reset your password.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === 'error' && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 text-center">
                                        {message}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {status === 'loading' ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Link'}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;