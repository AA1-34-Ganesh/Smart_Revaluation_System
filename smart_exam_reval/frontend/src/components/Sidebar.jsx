import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const getDashboardPath = () => {
        if (!user?.role) return '/student/dashboard';
        return `/${user.role}/dashboard`;
    };

    const navLinks = [
        { name: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard },
        { name: 'My Profile', path: '/profile', icon: User },
    ];

    return (
        <>
            {/* Mobile Overlay - Only visible on mobile when open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0`}
            >
                <div className="flex flex-col h-full py-6 px-4">

                    {/* User Snippet (Top) */}
                    <div className="mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 p-[2px] shadow-lg shadow-violet-500/20">
                                <div className="h-full w-full rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                                    <User className="h-5 w-5 text-violet-500 dark:text-violet-400" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-sm">{user?.name}</h3>
                                <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 space-y-1">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Menu</p>
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => {
                                        // Only close on mobile
                                        if (window.innerWidth < 1024) onClose();
                                    }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
                                        ${isActive(link.path)
                                            ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }
                                    `}
                                >
                                    {isActive(link.path) && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-violet-500 rounded-r-full" />
                                    )}

                                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive(link.path) ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`} />
                                    <span className="font-medium text-sm">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-auto group"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
