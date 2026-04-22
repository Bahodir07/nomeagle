import { http } from './http';
import type { UserProfile, ProfileDifficulty } from '../../features/profile/types';

export interface ProfileBasicsPayload {
  displayName: string;
  bio: string;
}

export interface ProfilePreferencesPayload {
  selectedCountries: string[];
  interests: string[];
  difficulty: ProfileDifficulty;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  newPassword_confirmation: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await http.get('/api/profile');
  return data.profile as UserProfile;
}

export async function updateProfileBasics(payload: ProfileBasicsPayload): Promise<void> {
  await http.patch('/api/profile', payload);
}

export async function updateProfilePreferences(payload: ProfilePreferencesPayload): Promise<void> {
  await http.patch('/api/profile/preferences', payload);
}

export async function updateProfilePassword(payload: UpdatePasswordPayload): Promise<void> {
  await http.patch('/api/profile/password', {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
    newPassword_confirmation: payload.newPassword_confirmation,
  });
}

export async function uploadAvatar(file: File): Promise<string> {
  const form = new FormData();
  form.append('avatar', file);
  const { data } = await http.post('/api/profile/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.avatarUrl as string;
}
