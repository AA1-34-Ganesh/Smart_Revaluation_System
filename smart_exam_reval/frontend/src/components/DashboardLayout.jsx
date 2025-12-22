import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    // Default closed on mobile (< 1024), naturally handled by Sidebar CSS (lg:translate-x-0)
    // We only need state for the MOBILE toggle.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            {/* Top Navigation (Fixed) */}
            <Navbar toggleSidebar={toggleSidebar} isDashboard={true} />

            {/* Layout Wrapper */}
            <div className="pt-16">

                {/* Sidebar (Fixed Left) */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content Area */}
                {/* ml-0 on mobile, ml-64 on desktop to push content */}
                <main className="transition-all duration-300 ml-0 lg:ml-64 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
