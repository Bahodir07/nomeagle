import { create } from 'zustand';
import axios from 'axios';
import type { AuthUser, LoginPayload, RegisterPayload } from '../api/auth';
import {
    loginRequest,
    logoutRequest,
    meRequest,
    registerRequest,
} from '../api/auth';

type AuthState = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isAuthChecked: boolean;
    globalError: string | null;

    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    clearError: () => void;
};

function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const responseMessage = error.response?.data?.message;
        if (typeof responseMessage === 'string' && responseMessage.trim()) {
            return responseMessage;
        }

        if (error.response?.status === 401) {
            return 'You are not authenticated.';
        }

        if (error.response?.status === 422) {
            return 'Please check the form fields.';
        }

        return error.message || 'Request failed.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Something went wrong.';
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isAuthChecked: false,
    globalError: null,

    clearError: () => set({ globalError: null }),

    fetchMe: async () => {
        set({ isLoading: true, globalError: null });

        try {
            const data = await meRequest();

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                isAuthChecked: true,
                globalError: null,
            });
        } catch {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
            });
        }
    },

    login: async (payload) => {
        set({ isLoading: true, globalError: null });

        try {
            await loginRequest(payload);
            const data = await meRequest();

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                isAuthChecked: true,
                globalError: null,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
                globalError: extractErrorMessage(error),
            });

            throw error;
        }
    },

    register: async (payload) => {
        set({ isLoading: true, globalError: null });

        try {
            await registerRequest(payload);
            const data = await meRequest();

            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                isAuthChecked: true,
                globalError: null,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
                globalError: extractErrorMessage(error),
            });

            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, globalError: null });

        try {
            await logoutRequest();
        } finally {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
                globalError: null,
            });
        }
    },
}));