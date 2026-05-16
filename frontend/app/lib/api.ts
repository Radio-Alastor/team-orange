import type { CommentDTO, LikeStatusDTO } from '../types/engagement';

// Use empty string to default to relative paths, so requests go through Nginx proxy
export const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path: string, options?: RequestInit) {
  const { headers: optionHeaders, ...restOptions } = options ?? {};
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...optionHeaders },
    ...restOptions,
  });
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
