import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';
import { GraduationCap, User, Building, Hash, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'; // Added Loader2
import Navbar from '../components/Navbar';

const Signup = () => {
    // We only need auth state here, not the global loading setter
    const { role, isAuthenticated, signupWithEmail } = useAuth();
    const navigate = useNavigate();

    
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        department: '',
        registerNumber: '',
        email: '',
        password: ''
    });

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && role) {
            if (role === 'student') navigate('/student/dashboard');
            else if (role === 'teacher') navigate('/teacher/dashboard');
            else if (role === 'admin') navigate('/admin/dashboard');
            else navigate('/');
        }
    }, [isAuthenticated, role, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation
        if (!formData.email || !formData.password || !formData.fullName) {
            toast.error("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        try {
            const result = await signupWithEmail(
                formData.email,
                formData.password,
                {
                    full_name: formData.fullName,
                    department: formData.department,
                    role: 'student',
                    register_number: formData.registerNumber,
                    reg_no: formData.registerNumber
                }
            );

            if (!result.success) {
                toast.error(result.error || "Signup failed");
                setIsLoading(false);
                return;
            }

            if (result.confirmationRequired) {
                toast.success("Account created! Please check your email to verify your account.");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast.success("Account created successfully! Setting up your dashboard...");
                // The AuthContext will handle the navigation via useEffect
                setTimeout(() => {
                    // Force a page reload to ensure clean state
                    window.location.href = '/student/dashboard';
                }, 2000);
            }

        } catch (error) {
            console.error("Signup Error:", error.message);
            toast.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-violet-500/30">
            <Navbar />
            <div className="pt-24 pb-12 min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                            <GraduationCap className="w-8 h-8 text-violet-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                        <p className="text-slate-400">Join as a Student</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Department</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="e.g. Computer Science"
                                    required
                                />
                            </div>
                        </div>

                        {/* Register Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Register Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Hash className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    name="registerNumber"
                                    value={formData.registerNumber}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="REG2023001"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;