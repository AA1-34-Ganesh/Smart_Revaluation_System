import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', title, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors ${className}`}
        >
            {(title || action) && (
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
                    {title && <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
                    {action && <div>{action}</div>}
                </div>
            )}

            <div className="p-6">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
