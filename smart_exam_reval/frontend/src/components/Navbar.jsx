import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, User, CreditCard, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InstallPWA from './InstallPWA';

const Navbar = ({ toggleSidebar }) => {
    const { isAuthenticated, logout, user, role } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Dynamic Paths based on Role
    const dashboardPath = role ? `/${role}/dashboard` : '/student/dashboard';
    const profilePath = '/profile';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
                <div className="flex justify-between items-center h-full">

                    {/* --- LEFT SIDE: BRAND & SIDEBAR TOGGLE --- */}
                    <div className="flex items-center gap-4">

                        {/* Sidebar Toggle (Visible if toggleSidebar prop exists) */}
                        {toggleSidebar && isAuthenticated && (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        )}

                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-violet-600 p-2 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
                                ReValuate
                            </span>
                        </Link>
                    </div>

                    {/* --- CENTER/RIGHT: DESKTOP NAVIGATION --- */}
                    <div className="hidden md:flex items-center gap-6">

                        <NavLink to="/" label="Home" active={isActive('/')} />

                        {isAuthenticated ? (
                            <>
                                {/* 1. DASHBOARD (Both) */}
                                <NavLink
                                    to={dashboardPath}
                                    label="Dashboard"
                                    icon={<LayoutDashboard className="w-4 h-4" />}
                                    active={isActive(dashboardPath)}
                                />

                                {/* 2. PROFILE (Both - Dynamic Path) */}
                                <NavLink
                                    to={profilePath}
                                    label="Profile"
                                    icon={<User className="w-4 h-4" />}
                                    active={isActive(profilePath)}
                                />

                                {/* 3. STUDENT ONLY LINKS */}
                                {role === 'student' && (
                                    <>
                                        <NavLink
                                            to="/student/payment"
                                            label="Payment"
                                            icon={<CreditCard className="w-4 h-4" />}
                                            active={isActive('/student/payment')}
                                        />
                                        <NavLink
                                            to="/track-status"
                                            label="Check Status"
                                            icon={<Search className="w-4 h-4" />}
                                            active={isActive('/track-status')}
                                        />
                                    </>
                                )}

                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden lg:block">
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{user?.full_name || user?.name || 'User'}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role}</div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                    <InstallPWA />
                                </div>
                            </>
                        ) : (
                            <>
                                <NavLink to="/track-status" label="Check Status" active={isActive('/track-status')} />

                                {/* Theme Toggle (Guest) */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>

                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-sm font-bold px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-colors shadow-lg"
                                >
                                    Sign Up
                                </Link>
                                <InstallPWA />
                            </>
                        )}
                    </div>

                    {/* --- MOBILE MENU TOGGLE --- */}
                    <div className="flex items-center gap-4 md:hidden">
                        <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MOBILE DROPDOWN --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 shadow-2xl">
                    <MobileLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileLink>
                    {isAuthenticated ? (
                        <>
                            <MobileLink to={dashboardPath} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileLink>
                            <MobileLink to={profilePath} onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileLink>

                            {/* Mobile Student Links */}
                            {role === 'student' && (
                                <>
                                    <MobileLink to="/student/payment" onClick={() => setIsMobileMenuOpen(false)}>Payment</MobileLink>
                                    <MobileLink to="/track-status" onClick={() => setIsMobileMenuOpen(false)}>Check Status</MobileLink>
                                </>
                            )}

                            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg">Logout</button>
                        </>
                    ) : (
                        <>
                            <MobileLink to="/track-status" onClick={() => setIsMobileMenuOpen(false)}>Check Status</MobileLink>
                            <MobileLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</MobileLink>
                            <MobileLink to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</MobileLink>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

// Helper Components
const NavLink = ({ to, label, icon, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-2 text-sm font-medium transition-all ${active
            ? 'text-slate-900 dark:text-white font-bold'
            : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
    >
        {icon}
        {label}
    </Link>
);

const MobileLink = ({ to, children, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white font-medium"
    >
        {children}
    </Link>
);

export default Navbar;