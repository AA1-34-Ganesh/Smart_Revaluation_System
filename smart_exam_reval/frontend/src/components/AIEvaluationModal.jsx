import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, XCircle, Sparkles, MessageSquare } from 'lucide-react';

const AIEvaluationModal = ({ isOpen, onClose, request, isTeacher = false, onAppeal }) => {
    if (!isOpen || !request) return null;

    const aiData = request.ai_feedback || {};
    const score = aiData.score || 0;
    const feedback = aiData.feedback || "No AI analysis available yet.";
    const teacherNotes = request.teacher_notes || "";
    const strongPoints = aiData.gap_analysis?.strong_points || [];
    const weakPoints = aiData.gap_analysis?.weak_points || [];

    const [professorSuggestions, setProfessorSuggestions] = useState(teacherNotes);
    const [appealText, setAppealText] = useState("");
    const [showAppealForm, setShowAppealForm] = useState(false);

    const handleSaveSuggestions = () => {
        // This would call an API to save professor's suggestions
        console.log("Saving suggestions:", professorSuggestions);
        onClose();
    };

    const handleSubmitAppeal = () => {
        if (appealText.trim()) {
            onAppeal && onAppeal(request.id, appealText);
            setAppealText("");
            setShowAppealForm(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl w-[95%] md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">AI Evaluation Report</h2>
                            <p className="text-sm text-slate-400">Request #{request.id.toString().slice(0, 8)} - {request.subject_code}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Score Circle */}
                    <div className="flex justify-center">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-blue-500 transition-all duration-1000 ease-out"
                                    strokeDasharray="440"
                                    strokeDashoffset={440 - (440 * score) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-white">{score}</span>
                                <span className="text-xs uppercase text-slate-500 font-bold">/10</span>
                                <span className="text-[10px] uppercase text-blue-400 font-bold mt-1">AI Score</span>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                        <h3 className="text-sm font-bold text-white mb-3">Detailed Feedback</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">{feedback}</p>
                    </div>

                    {/* Professor's Suggestions */}
                    {isTeacher ? (
                        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                            <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-violet-400" />
                                <h3 className="text-sm font-bold text-white">Professor's Suggestions:</h3>
                            </div>
                            <textarea
                                value={professorSuggestions}
                                onChange={(e) => setProfessorSuggestions(e.target.value)}
                                placeholder="Add your suggestions here..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:border-violet-500 outline-none resize-none text-sm leading-relaxed"
                                rows="4"
                            />
                        </div>
                    ) : (
                        teacherNotes && (
                            <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-800/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <MessageSquare className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-bold text-white">Professor's Suggestions:</h3>
                                </div>
                                <p className="text-sm text-slate-300 italic leading-relaxed">"{teacherNotes}"</p>
                            </div>
                        )
                    )}

                    {/* Strong & Weak Points Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Strong Points */}
                        <div className="bg-green-900/20 rounded-xl p-5 border border-green-800/30">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <h4 className="text-sm font-bold text-green-400">Strong Points</h4>
                            </div>
                            <ul className="space-y-2">
                                {strongPoints.length > 0 ? (
                                    strongPoints.map((point, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                            <span className="text-green-400 mt-0.5">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No specific points loaded</p>
                                )}
                            </ul>
                        </div>

                        {/* Missing / Improve */}
                        <div className="bg-red-900/20 rounded-xl p-5 border border-red-800/30">
                            <div className="flex items-center gap-2 mb-3">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <h4 className="text-sm font-bold text-red-400">Missing / Improve</h4>
                            </div>
                            <ul className="space-y-2">
                                {weakPoints.length > 0 ? (
                                    weakPoints.map((point, i) => (
                                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                                            <span className="text-red-400 mt-0.5">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic">No missed points detected</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Student Appeal Section */}
                    {!isTeacher && !showAppealForm && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowAppealForm(true)}
                                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-lg"
                            >
                                Appeal Result
                            </button>
                        </div>
                    )}

                    {/* Appeal Form */}
                    {!isTeacher && showAppealForm && (
                        <div className="bg-amber-900/20 rounded-xl p-5 border border-amber-800/30">
                            <h4 className="text-sm font-bold text-amber-400 mb-3">Submit Appeal</h4>
                            <textarea
                                value={appealText}
                                onChange={(e) => setAppealText(e.target.value)}
                                placeholder="Explain why you believe this evaluation needs review..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-300 focus:border-amber-500 outline-none resize-none text-sm"
                                rows="4"
                            />
                            <div className="flex gap-3 mt-3">
                                <button
                                    onClick={handleSubmitAppeal}
                                    disabled={!appealText.trim()}
                                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Submit Appeal
                                </button>
                                <button
                                    onClick={() => setShowAppealForm(false)}
                                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {isTeacher && (
                    <div className="p-6 border-t border-slate-800 bg-slate-950/50">
                        <button
                            onClick={handleSaveSuggestions}
                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg transition-all"
                        >
                            Save Suggestions & Close
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AIEvaluationModal;
