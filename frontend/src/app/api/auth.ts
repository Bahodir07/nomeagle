import { http } from './http';

export type LoginPayload = {
    email: string;
    password: string;
    remember?: boolean;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type AuthUser = {
    id: number;
    name: string;
    email: string;
};

export type AuthResponse = {
    message: string;
    user: AuthUser;
    token: string;
};

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/api/login', payload);
    return data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/api/register', payload);
    return data;
}

export async function logoutRequest(): Promise<void> {
    await http.post('/api/logout');
}

export async function meRequest() {
    const { data } = await http.get('/api/me');
    return data;
}

export async function forgotPasswordRequest(email: string): Promise<{ message: string }> {
    const { data } = await http.post('/api/forgot-password', { email });
    return data;
}

export async function resetPasswordRequest(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
}): Promise<{ message: string }> {
    const { data } = await http.post('/api/reset-password', payload);
    return data;
}
