// src/utils/axiosConfig.js
import axios from 'axios';
import { supabase } from '../supabase'; // Ensure this path points to your supabase client

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Flag to prevent infinite redirect loops when multiple 401s happen at once
let isRedirecting = false;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// =================================================================
// 1. REQUEST INTERCEPTOR
// Use Supabase SDK to get the token. This is safer than localStorage
// because it handles token refreshing automatically.
// =================================================================
api.interceptors.request.use(
    async (config) => {
        try {
            // "getSession" is fast; it checks memory first, then storage
            const { data } = await supabase.auth.getSession();
            const token = data.session?.access_token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn(' Failed to attach session token:', err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =================================================================
// 2. RESPONSE INTERCEPTOR
// Handles 401 (Unauthorized) & 403 (Forbidden) globally
// Prevents infinite redirect loops
// =================================================================
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response ? error.response.status : null;

        // Check for Auth errors
        if (status === 401 || status === 403) {
            console.warn(` Auth Error (${status}) detected.`);

            // Guard: If we are already redirecting, just fail this request silently
            // to avoid spamming the logout logic.
            if (!isRedirecting) {
                isRedirecting = true;
                console.warn(' Initiating forced logout...');

                // 1. Sign out from Supabase (clears backend session state)
                try {
                    await supabase.auth.signOut();
                } catch (e) {
                    console.warn('Supabase signout warning:', e);
                }

                // 2. Clear ALL browser storage
                localStorage.clear();
                sessionStorage.clear();

                // 3. Force Redirect to Login
                // Only redirect if we are NOT already on a public page
                const currentPath = window.location.pathname;
                const publicPaths = ['/login', '/signup', '/', '/track-status'];

                if (!publicPaths.some(path => currentPath.startsWith(path))) {
                    window.location.href = '/login';
                }

                // Reset flag after 2 seconds to allow future redirects if needed
                setTimeout(() => {
                    isRedirecting = false;
                }, 2000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;