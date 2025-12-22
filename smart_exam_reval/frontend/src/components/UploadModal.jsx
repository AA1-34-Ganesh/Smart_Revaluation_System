import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, FileText, Trash2, Plus, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';
import api from '../api/axios';
import toast from 'react-hot-toast';

const UploadModal = ({ request, onClose, onComplete }) => {
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const getAuthHeader = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return { Authorization: `Bearer ${session?.access_token}` };
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/') || file.type === 'application/pdf');

        if (imageFiles.length !== droppedFiles.length) {
            toast.error("Only image and PDF files are allowed");
        }

        setFiles(prev => [...prev, ...imageFiles]);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please add at least one file");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Uploading answer scripts...");

        try {

            // ✅ FIX: Do NOT inject auth manually (Interceptor does it)
            // ✅ FIX: Set Content-Type: undefined so Axios/Browser sets boundary
            // ✅ FIX: Use 'scripts' as field name to match backend: upload.array('scripts', 10)
            const formData = new FormData();

            files.forEach((file) => {
                formData.append('scripts', file);
            });
            formData.append('requestId', request.id);

            const response = await api.post('/teacher/upload-script', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });

            toast.success(`Uploaded ${files.length} file(s) successfully!`, { id: toastId });
            onComplete(response.data.file_urls || []);

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Upload Failed: " + (error.response?.data?.error || error.message), { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-3xl w-[95%] md:w-3/4 lg:w-1/2 shadow-2xl max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Upload Answer Script</h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Request #{request.id.toString().slice(0, 8)} - {request.subject_code}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Dropzone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                            ? 'border-violet-500 bg-violet-500/10'
                            : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                            }`}
                    >
                        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-300 font-medium mb-2">
                            Drag & drop answer script pages here
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            or click to browse (PDF, JPG, PNG)
                        </p>
                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium cursor-pointer transition-all">
                            <Plus className="w-4 h-4" />
                            Add Pages
                            <input
                                type="file"
                                multiple
                                accept="image/*,application/pdf"
                                onChange={handleFileInput}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-white">Added Files ({files.length})</h3>
                                <button
                                    onClick={() => setFiles([])}
                                    className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                                <FileText className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{file.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {(file.size / 1024).toFixed(2)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer - Always Visible */}
                <div className="p-6 border-t border-slate-800 flex gap-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-bold transition-all border border-slate-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || files.length === 0}
                        className="flex-[2] py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading & Analyzing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Analyze ({files.length})
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadModal;
