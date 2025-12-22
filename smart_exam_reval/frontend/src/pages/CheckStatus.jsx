import React, { useState } from 'react';
import { Search, Lock, ArrowRight, CheckCircle, Clock, AlertCircle, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';

const CheckStatus = () => {
    const [applicationId, setApplicationId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!applicationId.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        // Simulate API Call or Real Call
        try {
            // 1. Try fetching from Supabase (Real)
            const { data, error } = await supabase
                .from('revaluation_requests')
                .select('*')
                .eq('id', applicationId) // Assuming user types full ID
                .single();

            if (data) {
                setResult(data);
            } else {
                // 2. Fallback Mock for Demo (if ID matches "REV-123")
                if (applicationId === 'REV-123') {
                    await new Promise(r => setTimeout(r, 1000));
                    setResult({
                        id: 'REV-123456-7890',
                        subject_code: 'PYTHON',
                        subject_name: 'Python Programming',
                        created_at: new Date().toISOString(),
                        status: 'SUBMITTED' // Change this to 'PROCESSING' or 'PUBLISHED' to test bars
                    });
                } else {
                    throw new Error("Application not found");
                }
            }
        } catch (err) {
            setError("Application ID not found. Please check and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-violet-500/30 transition-colors duration-200">
            <Navbar />

            <div className="pt-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center">
                
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Check Application Status
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                        Enter your Application ID (e.g., REV-123456-7890) to track status.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full max-w-2xl">
                    <form onSubmit={handleSearch} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-2xl">
                            <Search className="ml-4 w-6 h-6 text-slate-400 dark:text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Enter Application ID" 
                                value={applicationId}
                                onChange={(e) => setApplicationId(e.target.value)}
                                className="w-full bg-transparent border-none text-slate-900 dark:text-white px-4 py-3 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-lg"
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {loading ? 'Tracking...' : 'Track'}
                            </button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 flex items-center gap-3"
                        >
                            <AlertCircle className="w-5 h-5" /> {error}
                        </motion.div>
                    )}
                </div>

                {/* --- RESULT SECTION (Status Card) --- */}
                <div className="w-full max-w-3xl mt-12">
                    <AnimatePresence mode='wait'>
                        {result ? (
                            <StatusCard data={result} key="result" />
                        ) : (
                            /* --- LOGIN PROMPT (Shown when no result) --- */
                            <motion.div 
                                key="login-prompt"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="w-full"
                            >
                                <div className="flex items-center gap-4 my-8">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                    <span className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-wider">OR VIEW MY APPLICATIONS</span>
                                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                                </div>

                                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center relative overflow-hidden group shadow-sm">
                                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
                                            <Lock className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Login to view your full application history</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                                            Access all your past revaluation requests, download reports, and manage payments in one place.
                                        </p>
                                        <Link 
                                            to="/login"
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 hover:scale-105"
                                        >
                                            Login Now <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Floating Assistant Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-105 text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-violet-500/30 flex items-center gap-2 transition-all">
                    <Bot className="w-5 h-5" /> Reval Assistant
                </button>
            </div>
        </div>
    );
};

// --- Sub-Component: Status Card with Progress Bar ---
const StatusCard = ({ data }) => {
    // Map status to progress step (0 to 3)
    const getStep = (status) => {
        if (!status) return 0;
        const s = status.toUpperCase();
        if (s === 'PUBLISHED' || s === 'COMPLETED') return 4;
        if (s === 'TEACHER_REVIEW' || s === 'FACULTY_REVIEW') return 3;
        if (s === 'PROCESSING' || s === 'AI_GRADING') return 2;
        return 1; // SUBMITTED
    };

    const currentStep = getStep(data.status);
    const steps = ["Submitted", "AI Grading", "Faculty Review", "Published"];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{data.subject_name || data.subject_code}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-mono flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{data.subject_code || 'CODE'}</span>
                        • Applied: {new Date(data.created_at).toLocaleDateString()}
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-xs font-bold border uppercase tracking-wider
                    ${data.status === 'PUBLISHED' ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : 
                      data.status === 'CLOSED' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                      'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'}`}>
                    {data.status || 'UNKNOWN'}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 relative">
                {/* Gray Background Line */}
                <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full absolute top-1/2 -translate-y-1/2 rounded-full"></div>
                
                {/* Blue Active Line */}
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-1 bg-blue-500 absolute top-1/2 -translate-y-1/2 rounded-full z-0"
                ></motion.div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                    {steps.map((step, index) => {
                        const isActive = index + 1 <= currentStep;
                        return (
                            <div key={index} className="flex flex-col items-center gap-2">
                                <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-500
                                    ${isActive ? 'bg-blue-500 border-blue-500' : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700'}`}>
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-wide transition-colors duration-500
                                    ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Current Status Box */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-bold mb-1">Current Status: {data.status}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {data.status === 'SUBMITTED' && "Application received. Waiting for processing to begin."}
                            {data.status === 'PROCESSING' && "AI is currently analyzing the answer script."}
                            {data.status === 'TEACHER_REVIEW' && "Faculty is reviewing the AI generated score."}
                            {data.status === 'PUBLISHED' && "Revaluation complete. Results are available in your dashboard."}
                        </p>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default CheckStatus;