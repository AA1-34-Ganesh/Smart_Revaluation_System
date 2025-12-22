import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCcw, Check, X, Upload, Plus, Trash2 } from 'lucide-react';

const CameraCapture = ({ onCapture, onRetake }) => {
    const webcamRef = useRef(null);
    const [useCamera, setUseCamera] = useState(false);
    const [pages, setPages] = useState([]); // Array of { file, preview }
    const [currentViewIndex, setCurrentViewIndex] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `page_${pages.length + 1}.jpg`, { type: "image/jpeg" });
                    const newPage = { file, preview: imageSrc };
                    setPages(prev => [...prev, newPage]);
                });
        }
    }, [webcamRef, pages]);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newPagesPromises = files.map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({ file, preview: reader.result });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(newPagesPromises).then(newPages => {
                setPages(prev => [...prev, ...newPages]);
            });
        }
    };

    const removePage = (index) => {
        setPages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFinish = () => {
        if (pages.length > 0) {
            const files = pages.map(p => p.file);
            // Pass the array of files and the first preview (or all previews if needed)
            onCapture(files, pages[0].preview);
        }
    };

    // If viewing a specific page in detail? (Optional, skipping for simplicity, just showing list)

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            {/* Viewport / Camera / Preview Area */}
            <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-slate-200 dark:border-slate-800 shadow-inner">
                {useCamera ? (
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: "environment" }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    pages.length > 0 ? (
                        <div className="relative w-full h-full group">
                            {/* Show the last captured page or the 'active' one */}
                            <img
                                src={pages[pages.length - 1].preview}
                                alt="Current Page"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-medium">Page {pages.length} Preview</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6 text-slate-500 dark:text-slate-400">
                            <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                            <p>Tap "Start Camera" or Upload Answer Sheets</p>
                        </div>
                    )
                )}
            </div>

            {/* Page Thumbnails */}
            {pages.length > 0 && (
                <div className="w-full flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
                    {pages.map((page, idx) => (
                        <div key={idx} className="relative flex-none w-20 h-20 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
                            <img src={page.preview} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removePage(idx)}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-sm hover:bg-red-700"
                            >
                                <X size={10} />
                            </button>
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center">{idx + 1}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap gap-4 w-full justify-center">
                {useCamera ? (
                    <>
                        <button
                            onClick={() => setUseCamera(false)}
                            className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                            <X size={24} />
                        </button>
                        <button
                            onClick={capture}
                            className="p-4 rounded-full bg-red-600 text-white shadow-lg transform active:scale-95 transition-all relative"
                        >
                            <div className="w-full h-full absolute inset-0 rounded-full border-4 border-white opacity-30"></div>
                            <Camera size={32} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setUseCamera(true)}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={20} /> Add Page (Camera)
                            </button>
                            <label className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors bg-white">
                                <Upload size={20} /> Add Page (Upload)
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,application/pdf"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>

                        {pages.length > 0 && (
                            <button
                                onClick={handleFinish}
                                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-md"
                            >
                                <Check size={20} /> Finish & Submit ({pages.length} Pages)
                            </button>
                        )}

                        {pages.length > 0 && (
                            <button
                                onClick={() => setPages([])}
                                className="text-sm text-red-500 hover:text-red-700 flex items-center justify-center gap-1"
                            >
                                <Trash2 size={14} /> Clear All
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraCapture;
