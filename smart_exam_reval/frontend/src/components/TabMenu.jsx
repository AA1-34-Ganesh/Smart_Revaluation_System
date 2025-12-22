import React from 'react';

const TabMenu = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex space-x-1 rounded-xl bg-slate-100 dark:bg-slate-900 p-1 mb-6 border border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 transition-all ${
                        activeTab === tab
                            ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TabMenu;
