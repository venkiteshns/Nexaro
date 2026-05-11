import axios from 'axios';
import useAuthStore from '../store/store.js';

const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor: Attach the access token to outgoing requests
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Capture tokens from responses and handle 401 auto-refresh
api.interceptors.response.use(
    (response) => {
        // Automatically save tokens and user data if they exist in the response
        if (response.data) {
            const { accessToken, refreshToken, responseUser } = response.data;
            
            if (accessToken) {
                useAuthStore.getState().setToken(accessToken);
            }
            if (responseUser) {
                useAuthStore.getState().setUser(responseUser); // saves id, name, email, role, etc.
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // If a 401 Unauthorized is returned, and it's not already a retry
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                
                // Call the refresh endpoint (adjust the path if yours is different)
                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken
                });
                
                const newAccessToken = refreshResponse.data.accessToken;
                
                // Update Zustand with the new token
                useAuthStore.getState().setToken(newAccessToken);
                // Also update local storage if a new refresh token is returned
                if (refreshResponse.data.refreshToken) {
                    localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                }
                
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // If the refresh token also fails or is expired, log out entirely
                useAuthStore.getState().clearUser();
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);
