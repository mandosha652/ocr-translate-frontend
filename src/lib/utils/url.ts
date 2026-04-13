import { API_BASE_URL } from '@/lib/constants/api';

export function getImageUrl(path: string): string {
  if (!path) return '';
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${Date.now()}`;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
