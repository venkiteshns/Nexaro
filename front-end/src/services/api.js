import axios from 'axios';
import useAuthStore from '../store/store.js';

const API_BASE_URL = "http://localhost:8000/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

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

api.interceptors.response.use(
    (response) => {

        if (response.data) {
            const { accessToken, refreshToken, responseUser, otpToken } = response.data;

            if (accessToken) {
                useAuthStore.getState().setToken(accessToken);
            }
            if (responseUser) {
                useAuthStore.getState().setUser(responseUser);
            }
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            if (otpToken) {
                sessionStorage.setItem('otpToken', otpToken);
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken
                });

                const newAccessToken = refreshResponse.data.accessToken;

                useAuthStore.getState().setToken(newAccessToken);

                if (refreshResponse.data.refreshToken) {
                    localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);

            } catch (refreshError) {
                useAuthStore.getState().clearUser();
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
