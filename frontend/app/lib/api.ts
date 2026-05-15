// Use empty string to default to relative paths, so requests go through Nginx proxy
export const API_BASE = import.meta.env.VITE_API_URL || '';

export async function apiFetch(path: string, options?: RequestInit) {
  const { headers: optionHeaders, ...restOptions } = options ?? {};
  return fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...optionHeaders },
    ...restOptions,
  });
}
