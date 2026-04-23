export interface AuthData {
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  email: string;
}

export const getToken = () => sessionStorage.getItem('sg_token');
export const getUser = (): Omit<AuthData, 'token' | 'refreshToken'> | null =>
  JSON.parse(sessionStorage.getItem('sg_user') ?? 'null');

export function setAuth(data: AuthData) {
  sessionStorage.setItem('sg_token', data.token);
  sessionStorage.setItem('sg_refresh_token', data.refreshToken);
  sessionStorage.setItem('sg_user', JSON.stringify({
    userId: data.userId,
    name: data.name,
    email: data.email,
  }));
}

export function clearAuth() {
  sessionStorage.removeItem('sg_token');
  sessionStorage.removeItem('sg_refresh_token');
  sessionStorage.removeItem('sg_user');
}
