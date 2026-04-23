export interface AuthData {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
  staff: boolean;
}

const isBrowser = typeof window !== 'undefined';

export const getToken = () => isBrowser ? sessionStorage.getItem('sg_token') : null;
export const getUser = (): Omit<AuthData, 'token' | 'refreshToken'> | null =>
  isBrowser ? JSON.parse(sessionStorage.getItem('sg_user') ?? 'null') : null;

export function setAuth(data: AuthData) {
  sessionStorage.setItem('sg_token', data.token);
  sessionStorage.setItem('sg_refresh_token', data.refreshToken);
  sessionStorage.setItem('sg_user', JSON.stringify({
    userId: data.userId,
    name: data.name,
    email: data.email,
    staff: data.staff,
  }));
}

export function clearAuth() {
  sessionStorage.removeItem('sg_token');
  sessionStorage.removeItem('sg_refresh_token');
  sessionStorage.removeItem('sg_user');
}
