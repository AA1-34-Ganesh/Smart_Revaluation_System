import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'student', 'teacher', 'admin'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchUserRole = async (currentUser) => {
            try {
                // Fetch extra profile data (role, reg_no, etc) from 'users' table
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                if (!mounted) return;

                if (data) {
                    // Merge Auth metadata with Database data
                    const userData = {
                        ...currentUser,
                        ...data,
                        name: data.full_name || currentUser.user_metadata?.full_name
                    };
                    setUser(userData);
                    setRole(data.role || 'student');
                } else {
                    // Fallback: If user exists in Auth but not in DB (Trigger delay?)
                    console.warn("User profile not found in DB, defaulting to Student.");
                    setUser({
                        ...currentUser,
                        name: currentUser.user_metadata?.full_name
                    });
                    setRole('student');
                }
            } catch (err) {
                console.error("Role Fetch Error:", err);
                if (mounted) setRole('student'); // Safety fallback
            } finally {
                if (mounted) setLoading(false);
            }
        };

        const initAuth = async () => {
            try {
                // 1. Check active session immediately
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    await fetchUserRole(session.user);
                } else {
                    if (mounted) setLoading(false);
                }

                // 2. Listen for auth changes
                const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                    if (!mounted) return;

                    console.log('🔐 Auth State Change:', event, session ? 'Session Active' : 'No Session');

                    if (session?.user) {
                        // Optimisation: Only fetch role if user changed
                        if (!user || user.id !== session.user.id) {
                            await fetchUserRole(session.user);
                        }
                    } else {
                        // Handle Logout
                        setUser(null);
                        setRole(null);
                        setLoading(false);
                    }
                });

                return () => {
                    subscription?.unsubscribe();
                };
            } catch (error) {
                console.error("Auth Init Error:", error);
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- 1. GOOGLE LOGIN ---
    const loginWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account',
                    },
                },
            });
            if (error) throw error;
        } catch (error) {
            toast.error(`Login Failed: ${error.message}`);
        }
    };

    // --- 2. EMAIL/PASSWORD LOGIN (CRITICAL FIX) ---
    const loginWithEmail = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            
            // Allow immediate UI feedback before the listener kicks in
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error.message);
            toast.error(error.message === "Invalid login credentials" 
                ? "Incorrect email or password." 
                : error.message);
            return { success: false, error: error.message };
        }
    };

    // --- 3. EMAIL/PASSWORD SIGNUP ---
    const signupWithEmail = async (email, password, metadata) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/login`,
                    data: metadata
                }
            });

            if (error) throw error;

            // Check if email already exists
            if (data?.user && data?.user?.identities?.length === 0) {
                return { success: false, error: "Email already registered" };
            }

            // Check if confirmation is required
            if (data.user && !data.session) {
                return { success: true, confirmationRequired: true };
            }

            // Auto-login (confirmation disabled)
            if (data.session) {
                // Wait for DB trigger to complete
                await new Promise(resolve => setTimeout(resolve, 1500));
                return { success: true, confirmationRequired: false, session: data.session };
            }

            return { success: true };
        } catch (error) {
            console.error("Signup Error:", error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setRole(null);
            toast.success("Logged out successfully");
            window.location.href = "/"; 
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const value = {
        user,
        role,
        loading,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithEmail, // Exported
        signupWithEmail, // Exported
        logout
    };

    // Global Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-violet-400 font-mono text-sm animate-pulse">Establishing Secure Session...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};