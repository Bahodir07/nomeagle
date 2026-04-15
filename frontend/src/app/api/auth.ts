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

export async function csrfCookie() {
    await http.get('/sanctum/csrf-cookie');
}

export async function loginRequest(payload: LoginPayload) {
    await csrfCookie();
    const { data } = await http.post('/login', payload);
    return data;
}

export async function registerRequest(payload: RegisterPayload) {
    await csrfCookie();
    const { data } = await http.post('/register', payload);
    return data;
}

export async function logoutRequest() {
    const { data } = await http.post('/logout');
    return data;
}

export async function meRequest() {
    const { data } = await http.get('/api/me');
    return data;
}