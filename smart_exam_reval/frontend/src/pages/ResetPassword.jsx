import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // No useSearchParams needed if using path param
import Navbar from '../components/Navbar';
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.new !== passwords.confirm) {
            setStatus('error');
            setMessage("Passwords don't match");
            return;
        }

        if (passwords.new.length < 6) {
            setStatus('error');
            setMessage("Password must be at least 6 characters");
            return;
        }

        setStatus('loading');
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: passwords.new
            });
            setStatus('success');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || "Failed to reset password. Link might be expired.");
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-200">
                <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invalid Link</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">This password reset link is invalid or missing.</p>
                    <Link to="/login" className="mt-6 inline-block text-blue-600 font-medium hover:underline">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800"
                >
                    {status === 'success' ? (
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password Reset Successful!</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">You will be redirected to the login page shortly.</p>
                            <Link to="/login" className="block w-full py-3 px-4 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-all text-center">
                                Login Now
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="mx-auto w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set New Password</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">Please enter a new password for your account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status === 'error' && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 text-center">
                                        {message}
                                    </div>
                                )}

                                <div>

                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="••••••••"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="••••••••"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {status === 'loading' ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
