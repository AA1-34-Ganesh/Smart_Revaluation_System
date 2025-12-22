import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';  // Already contains unified config
import {
    User, Mail, Book, Trophy, Edit3,
    Save, CheckCircle, Briefcase, Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Profile = () => {
    const { user, role } = useAuth(); // Assuming 'role' is passed from AuthContext
    const [isEditing, setIsEditing] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    // Consolidated state for both Student & Teacher fields
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        department: '',
        // Student Specific
        reg_no: '',
        semester: '1',
        // Teacher Specific
        subject_specialization: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || user.user_metadata?.full_name || '',
                email: user.email || '',
                department: user.department || '',
                reg_no: user.reg_no || '',
                semester: user.semester || '1',
                subject_specialization: user.subject_specialization || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        try {
            // Build the update payload
            const updates = {
                full_name: formData.full_name,
                department: formData.department,
            };

            // Role-specific updates
            if (role === 'student') {
                updates.reg_no = formData.reg_no;
                await api.put('/api/student/profile', updates);
            } else if (role === 'teacher') {
                updates.subject_specialization = formData.subject_specialization;
                await api.put('/api/teacher/profile', updates);
            }

            toast.success("Profile Updated Successfully");
            setIsEditing(false);

        } catch (err) {
            console.error("Update Error:", err);
            const errorMsg = err.response?.data?.message || "Update Failed";
            toast.error(errorMsg);
        } finally {
            setLoadingUpdate(false);
        }
    };

    // Dynamic Theme based on Role
    const isTeacher = role === 'teacher';
    const themeColor = isTeacher ? 'emerald' : 'violet';
    const gradientClass = isTeacher
        ? 'from-emerald-600 to-teal-600'
        : 'from-violet-600 to-indigo-600';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-violet-500/30 transition-colors duration-200">
            <Navbar />

            <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">

                {/* --- HEADER BANNER --- */}
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className={`h-40 bg-gradient-to-r ${gradientClass} relative`}>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col md:flex-row items-end -mt-12 gap-6 relative z-10">
                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                // Dynamic Icon Color
                                <div className={isTeacher ? "text-emerald-500" : "text-violet-500"}>
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{formData.full_name || 'User'}</h1>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {formData.email}</span>
                                <span className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></span>
                                <span className={`uppercase font-bold ${isTeacher ? 'text-emerald-600 dark:text-emerald-400' : 'text-violet-600 dark:text-violet-400'}`}>
                                    {isTeacher ? 'Faculty Member' : 'Student'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-all text-sm mb-2 shadow-sm"
                        >
                            {isEditing ? <><Save className="w-4 h-4" /> Cancel</> : <><Edit3 className="w-4 h-4" /> Edit Profile</>}
                        </button>
                    </div>
                </div>

                {/* --- FORM GRID --- */}
                <form onSubmit={handleUpdate} className="grid md:grid-cols-3 gap-6">

                    {/* Main Details Section */}
                    <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            {isTeacher ? (
                                <Briefcase className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <Book className="w-5 h-5 text-violet-500" />
                            )}
                            {isTeacher ? 'Faculty Details' : 'Academic Details'}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* --- Common Fields --- */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input
                                    name="full_name"
                                    disabled={!isEditing}
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-violet-500 outline-none transition-colors disabled:text-slate-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    disabled={!isEditing}
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g. Computer Science"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-violet-500 outline-none transition-colors disabled:text-slate-500"
                                />
                            </div>

                            {/* --- CONDITIONAL FIELDS --- */}
                            {isTeacher ? (
                                // TEACHER VIEW
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Subject Specialization</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                                        <input
                                            disabled={!isEditing}
                                            value={formData.subject_specialization}
                                            onChange={(e) => setFormData({ ...formData, subject_specialization: e.target.value })}
                                            placeholder="e.g. Computer Networks, AI"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:border-emerald-500 outline-none transition-colors disabled:text-slate-500"
                                        />
                                    </div>
                                </div>
                            ) : (
                                // STUDENT VIEW
                                <>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Reg Number</label>
                                        <input
                                            disabled={!isEditing}
                                            value={formData.reg_no}
                                            onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-violet-500 outline-none transition-colors disabled:text-slate-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                                        <input
                                            disabled
                                            value={formData.semester}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loadingUpdate}
                                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isTeacher
                                        ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                        : 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20'
                                        }`}
                                >
                                    {loadingUpdate ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Account Status */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" /> Account Status
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Role</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${isTeacher
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
                                        }`}>
                                        {role || 'Guest'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Verified</span>
                                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1 text-xs font-bold uppercase"><CheckCircle className="w-3 h-3" /> Yes</span>
                                </div>
                            </div>
                        </div>

                        {/* Conditional Bottom Card */}
                        <div className={`mt-6 p-4 rounded-2xl text-center border ${isTeacher
                            ? 'bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20'
                            : 'bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20'
                            }`}>
                            {isTeacher ? (
                                <>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Assigned Subjects</p>
                                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">3</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Pending Evaluations</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">Revaluation Credits</p>
                                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">200 pts</p>
                                    <p className="text-[10px] text-slate-500 mt-1">Next Reset: Dec 31</p>
                                </>
                            )}
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Profile;