import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const url = error.config?.url ?? '';
            // Skip redirect on /api/me — it's the startup auth probe
            if (error.response?.status === 401 && !url.includes('/api/me')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);