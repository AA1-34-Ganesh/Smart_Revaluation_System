import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
