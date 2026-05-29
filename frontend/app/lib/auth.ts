import { redirect } from "react-router";
import { apiFetch } from "./api";

export interface AuthData {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  staff: boolean;
}

const isBrowser = typeof window !== 'undefined';

export const getToken = () => isBrowser ? localStorage.getItem('sg_token') : null;
export const getUser = (): Omit<AuthData, 'token' | 'refreshToken'> | null =>
  isBrowser ? JSON.parse(localStorage.getItem('sg_user') ?? 'null') : null;

export function setAuth(data: AuthData) {
  localStorage.setItem('sg_token', data.token);
  localStorage.setItem('sg_refresh_token', data.refreshToken);
  localStorage.setItem('sg_user', JSON.stringify({
    userId: data.userId,
    name: data.name,
    email: data.email,
    staff: data.staff,
  }));
}

export function clearAuth() {
  localStorage.removeItem('sg_token');
  localStorage.removeItem('sg_refresh_token');
  localStorage.removeItem('sg_user');
}

/**
 * Validates the token with the backend and returns the user object if authenticated.
 * If not authenticated or token is invalid, returns null without throwing.
 * Perfect for public pages (like articles) that hide/show features based on auth.
 */
export async function getOptionalAuthUser() {
  const token = getToken();
  if (!token) return { token: null, user: null };

  try {
    const res = await apiFetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { token: null, user: null };
    const user = await res.json();
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

/**
 * Validates the token with the backend and ensures the user is authenticated.
 * If authentication fails, throws a redirect to /login.
 * Perfect for generic User Profile or Settings pages.
 */
export async function requireAuthUser() {
  const { token, user } = await getOptionalAuthUser();
  if (!token || !user) throw redirect("/login?reason=unauthorized");
  return { token, user };
}

/**
 * Validates the token with the backend and ensures the user is staff.
 * If authentication fails or the user is not staff, throws a redirect to /login.
 * Useful for reusing in React Router loaders.
 */
export async function requireStaffUser() {
  const { token, user } = await requireAuthUser();
  if (!user?.staff) throw redirect("/login?reason=unauthorized");
  return { token, user };
}
