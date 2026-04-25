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
