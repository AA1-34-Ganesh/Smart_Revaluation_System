import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';

const RevaluationForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const subject = location.state?.subject;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!subject) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex flex-1">
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    <main className="flex-1 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Subject Selected</h2>
                            <button
                                onClick={() => navigate('/student/dashboard')}
                                className="mt-4 text-blue-600 hover:underline"
                            >
                                Go back to dashboard
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
            <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 relative">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                <main className="flex-1 p-4 lg:p-8">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
                        </button>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Review Application</h1>

                        <Card>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Subject Name</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{subject.subject}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Subject Code</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{subject.code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Current Marks</span>
                                    <span className="font-medium text-slate-900 dark:text-white">{subject.marks}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-4"></div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-slate-900 dark:text-white">Revaluation Fee</span>
                                    <span className="text-blue-600 dark:text-blue-400">₹500.00</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={() =>
                                        navigate('/student/revaluation/payment', { state: { subject } })
                                    }
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default RevaluationForm;
