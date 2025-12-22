import React from 'react';
import { X, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const AIFeedbackModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const { score, total, feedback, breakdown, ocrText } = data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-transparent dark:border-slate-800">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Revaluation Report</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automated analysis of answer sheet</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-slate-900">

                    {/* Score Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-6 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Estimated Score</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">{score || 0}</span>
                                <span className="text-xl text-slate-500 dark:text-slate-400">/ {total || 100}</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-medium ${score >= 40
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {score >= 40 ? 'PASS' : 'NEEDS IMPROVEMENT'}
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <FileText size={18} className="text-slate-500 dark:text-slate-400" />
                            Detailed Analysis
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-slate-700 dark:text-slate-300 leading-relaxed text-sm border border-transparent dark:border-slate-700">
                            {feedback || "No detailed feedback available."}
                        </div>
                    </div>

                    {/* Breakdown / Strong & Weak Points */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle size={16} /> Strong Points
                            </h4>
                            <ul className="space-y-2">
                                {breakdown?.strengths?.map((point, i) => (
                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 bg-green-50/50 dark:bg-green-900/20 p-2 rounded border border-green-100 dark:border-green-900/30">
                                        {point}
                                    </li>
                                )) || <p className="text-sm text-slate-400 italic">None detected</p>}
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                                <AlertCircle size={16} /> Areas for Improvement
                            </h4>
                            <ul className="space-y-2">
                                {breakdown?.weaknesses?.map((point, i) => (
                                    <li key={i} className="text-sm text-slate-600 dark:text-slate-300 bg-amber-50/50 dark:bg-amber-900/20 p-2 rounded border border-amber-100 dark:border-amber-900/30">
                                        {point}
                                    </li>
                                )) || <p className="text-sm text-slate-400 italic">None detected</p>}
                            </ul>
                        </div>
                    </div>

                    {/* OCR Text Preview (Optional/Collapsible) */}
                    {ocrText && (
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                            <details className="group">
                                <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                                    <span>View Extracted Text (OCR)</span>
                                    <span className="transition-transform group-open:rotate-180">▼</span>
                                </summary>
                                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800">
                                    {ocrText}
                                </div>
                            </details>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800 text-center bg-gray-50/50 dark:bg-slate-900/50 text-xs text-gray-400 dark:text-gray-500">
                    AI generated results are provisional. Final marks are subject to manual verification.
                </div>
            </div>
        </div>
    );
};

export default AIFeedbackModal;
