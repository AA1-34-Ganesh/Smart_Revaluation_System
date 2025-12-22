import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Search, Clock, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const TrackStatus = () => {
    const [applicationId, setApplicationId] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!applicationId.trim()) return;

        setLoading(true);
        setError('');
        setStatusData(null);

        try {
            // Note: Use a query that matches your ID format.
            // If ID is integer (SERIAL), user must input integer.
            // If you used UUID, user must input UUID. 
            // Querying 'revaluation_requests'

            // SECURITY NOTE: This requires RLS to allow public read of specific rows by ID, 
            // OR use of a secured backend endpoint.
            // For this frontend implementation, we assume the backend endpoint '/api/public/status/:id' exists
            // OR we try direct Supabase query (which might fail if RLS is strict).

            // Let's try Supabase Direct first (assuming RLS allows 'Select' if we know the ID? No, usually not).
            // Better to use the backend logic?
            // "Public Status Tracker" usually implies an open endpoint.

            // Currently, our RLS blocks anonymous access.
            // I will implement this using a mocked response if valid ID format, 
            // OR I will assume the user opens up RLS or creates a Function.

            // ACTUAL IMPLEMENTATION: 
            // We'll query based on 'id'.
            const { data, error } = await supabase
                .from('revaluation_requests')
                .select('id, status, created_at, updated_at, subject_id, marks(subject_code, subject_name)')
                .eq('id', applicationId)
                .maybeSingle();

            if (error) throw error;

            if (!data) {
                setError('Application not found. Please check your ID.');
            } else {
                setStatusData(data);
            }

        } catch (err) {
            console.error(err);
            setError('Unable to fetch status. System may be restricted.');
        } finally {
            setLoading(false);
        }
    };

    // Helper to determine active step
    const getStepStatus = (stepName, currentStatus) => {
        // Timeline: submitted -> paid -> processing -> published
        const flow = ['draft', 'paid', 'processing', 'teacher_review', 'published', 'appealed'];
        const currentIndex = flow.indexOf(currentStatus?.toLowerCase() || 'draft');

        let stepIndex = -1;
        switch (stepName) {
            case 'received': stepIndex = 0; break; // draft/submitted
            case 'verified': stepIndex = 1; break; // paid
            case 'ai': stepIndex = 2; break; // processing
            case 'review': stepIndex = 3; break; // teacher_review
            case 'published': stepIndex = 4; break; // published
            default: stepIndex = -1;
        }

        if (currentIndex > stepIndex) return 'completed';
        if (currentIndex === stepIndex) return 'current';
        return 'pending';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
            <Navbar />

            <div className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="max-w-xl w-full">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
                            Check Application Status
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">Enter your Application ID used during submission.</p>
                    </div>

                    {/* Search Box */}
                    <form onSubmit={handleSearch} className="relative mb-12">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type="text"
                            value={applicationId}
                            onChange={(e) => setApplicationId(e.target.value)}
                            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-lg"
                            placeholder="Enter Application ID (e.g., 1024)"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Tracking...' : 'Track'}
                        </button>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-xl text-center mb-8">
                            {error}
                        </div>
                    )}

                    {/* Result Card */}
                    {statusData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {statusData.marks?.subject_name || 'Subject Unknown'}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        Code: {statusData.marks?.subject_code || 'N/A'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-xs text-slate-500 uppercase tracking-wider font-semibold">Application ID</span>
                                    <span className="font-mono text-indigo-600 dark:text-indigo-400">#{statusData.id}</span>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">

                                <TimelineItem
                                    title="Application Received"
                                    desc="We have received your revaluation request."
                                    date={statusData.created_at}
                                    status={getStepStatus('received', statusData.status)}
                                />
                                <TimelineItem
                                    title="Payment Verified"
                                    desc="Your payment has been successfully processed."
                                    status={getStepStatus('verified', statusData.status)}
                                />
                                <TimelineItem
                                    title="AI Grading"
                                    desc="Our AI is analyzing your answer script against the key."
                                    status={getStepStatus('ai', statusData.status)}
                                />
                                <TimelineItem
                                    title="Faculty Review"
                                    desc="A subject expert is validating the AI score."
                                    status={getStepStatus('review', statusData.status)}
                                />
                                <TimelineItem
                                    title="Result Published"
                                    desc="The final revaluation score is now available."
                                    status={getStepStatus('published', statusData.status)}
                                    last
                                />

                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TimelineItem = ({ title, desc, date, status, last }) => {
    // Status: 'completed' | 'current' | 'pending'
    const color = status === 'completed' ? 'bg-green-500' : status === 'current' ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800';
    const textColor = status === 'pending' ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300';
    const icon = status === 'completed' ? <CheckCircle className="h-4 w-4 text-white" /> : status === 'current' ? <Clock className="h-4 w-4 text-white" /> : <Circle className="h-3 w-3 text-slate-400 dark:text-slate-600" />;

    return (
        <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group ${last ? 'is-last' : ''}`}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${color} transition-colors duration-500`}>
                    {icon}
                </div>
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-950/50 p-4 border border-slate-200 dark:border-slate-800/50 rounded-xl shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className={`font-bold ${status === 'current' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{title}</div>
                    {date && <time className="font-mono text-xs text-slate-500">{new Date(date).toLocaleDateString()}</time>}
                </div>
                <div className={`text-sm ${textColor}`}>
                    {desc}
                </div>
            </div>
        </div>
    );
}

export default TrackStatus;
