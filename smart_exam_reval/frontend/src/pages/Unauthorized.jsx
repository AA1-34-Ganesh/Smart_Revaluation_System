import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-4 transition-colors duration-200">
            <div className="bg-red-100 dark:bg-red-500/10 p-4 rounded-full mb-6">
                <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-500" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
                You do not have permission to view this page. Please contact your administrator if you believe this is a mistake.
            </p>

            <Link
                to="/"
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white hover:bg-indigo-50 dark:hover:bg-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-600 transition-all"
            >
                <ArrowLeft className="h-4 w-4" />
                Return Home
            </Link>
        </div>
    );
};

export default Unauthorized;
