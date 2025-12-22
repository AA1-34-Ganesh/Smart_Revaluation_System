import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} />
        </div>
    );
};

export default Loader;
