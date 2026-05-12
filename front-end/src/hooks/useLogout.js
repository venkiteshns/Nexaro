import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/store.js';
import { useToast } from './useToast.js';
import { api } from '../services/api.js';


export const useLogout = () => {
    const navigate = useNavigate();
    const clearUser = useAuthStore((state) => state.clearUser);
    const toast = useToast();

    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    const logout = async (redirectPath = '/login') => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            // 1. Notify backend — invalidates refresh token server-side
            await api.post('/auth/logout').catch(() => {
                // Silent fail — even if backend is unreachable, client MUST log out
            });
        } finally {
            // 2. Clear Zustand in-memory auth store
            clearUser();

            // 3. Wipe all persisted storage
            localStorage.clear();
            sessionStorage.clear();

            // 4. Expire all browser cookies (including httpOnly-accessible ones via Set-Cookie)
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
            });

            // 5. Premium user feedback
            toast.success('Signed out successfully.');

            setIsLoggingOut(false);

            // 6. Replace history so browser back button cannot return to protected pages
            navigate(redirectPath, { replace: true });
        }
    };

    return { logout, isLoggingOut };
};
