import type { CommentDTO, LikeStatusDTO } from '../types/engagement';
import type { AdminArticleDTO, Page, ArticleStatus, AdminMetricsDTO, UserAdminDTO } from '../types/admin';

// Use empty string to default to relative paths, so requests go through Nginx proxy
export const API_BASE = import.meta.env.VITE_API_URL || '';

const isBrowser = typeof window !== 'undefined';

/**
 * Attempts a silent token refresh using the stored refresh token.
 * Returns the new access token on success, or null on failure.
 * On failure, stored auth is cleared so the user is treated as logged out.
 */
async function attemptTokenRefresh(): Promise<string | null> {
  if (!isBrowser) return null;
  const refreshToken = localStorage.getItem('sg_refresh_token');
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      // Refresh token is invalid or expired — clear everything
      localStorage.removeItem('sg_token');
      localStorage.removeItem('sg_refresh_token');
      localStorage.removeItem('sg_user');
      return null;
    }
    const data = await res.json();
    localStorage.setItem('sg_token', data.token);
    localStorage.setItem('sg_refresh_token', data.refreshToken);
    // Preserve existing user meta while updating staff flag in case it changed
    const stored = JSON.parse(localStorage.getItem('sg_user') ?? '{}');
    localStorage.setItem('sg_user', JSON.stringify({ ...stored, staff: data.staff }));
    return data.token as string;
  } catch {
    return null;
  }
}

/**
 * Thin wrapper around fetch that automatically retries with a refreshed token
 * on a 401 response. If the refresh also fails, auth is cleared and the 401
 * response is returned so callers / loaders can handle the redirect.
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const { headers: optionHeaders, ...restOptions } = options ?? {};
  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(optionHeaders as Record<string, string> ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    headers: baseHeaders,
    ...restOptions,
  });

  // Backend currently returns 403 for expired/invalid JWT (anonymous user denied).
  // Also handle 401 for correctness after the backend SecurityConfig fix is deployed.
  if ((res.status === 401 || res.status === 403) && isBrowser && !path.includes('/api/auth/')) {
    const newToken = await attemptTokenRefresh();
    if (newToken) {
      // Retry the original request with the new access token
      return fetch(`${API_BASE}${path}`, {
        ...restOptions,
        headers: { ...baseHeaders, Authorization: `Bearer ${newToken}` },
      });
    }
    // Refresh failed — return original 401 so loaders can redirect to /login
  }

  return res;
}

export async function getLikeStatus(articleId: string | number, token?: string): Promise<LikeStatusDTO> {
  const headers: HeadersInit = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await apiFetch(`/api/articles/${articleId}/engagements/like-status`, { headers });
  if (!res.ok) throw new Error('Failed to fetch like status');
  return res.json();
}

export async function toggleLike(articleId: string | number, token: string): Promise<LikeStatusDTO> {
  const res = await apiFetch(`/api/articles/${articleId}/engagements/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  return res.json();
}

export async function getComments(articleId: string | number, page = 0, size = 10): Promise<{ content: CommentDTO[], totalPages: number, totalElements: number }> {
  const res = await apiFetch(`/api/articles/${articleId}/engagements/comments?page=${page}&size=${size}`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function addComment(articleId: string | number, text: string, token: string): Promise<CommentDTO> {
  const res = await apiFetch(`/api/articles/${articleId}/engagements/comments`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export async function deleteComment(commentId: string, token: string): Promise<void> {
  const res = await apiFetch(`/api/articles/engagements/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete comment');
}

export async function getAdminMetrics(token: string): Promise<AdminMetricsDTO> {
  const res = await apiFetch(`/api/admin/metrics`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin metrics');
  return res.json();
}

export async function getAdminUsers(token: string): Promise<UserAdminDTO[]> {
  const res = await apiFetch(`/api/admin/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin users');
  return res.json();
}

export async function getAdminArticles(token: string, page = 0, size = 10, sort = "createdAt,desc"): Promise<Page<AdminArticleDTO>> {
  const res = await apiFetch(`/api/admin/articles?page=${page}&size=${size}&sort=${sort}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch admin articles');
  return res.json();
}

export async function updateArticleStatus(id: number, status: ArticleStatus, token: string): Promise<void> {
  const res = await apiFetch(`/api/admin/articles/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to update article status');
}

export async function deleteAdminArticle(id: number, token: string): Promise<void> {
  const res = await apiFetch(`/api/admin/articles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to delete article');
}
