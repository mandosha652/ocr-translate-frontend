import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';
import { API_BASE_URL } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a relative image path to a full URL using the API base URL
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}

const ERROR_MAP: Record<string, string> = {
  // Auth
  'invalid credentials': 'Incorrect email or password',
  'user not found': 'No account found with that email',
  'email already registered': 'An account with this email already exists',
  'email already exists': 'An account with this email already exists',
  'invalid token': 'Your session has expired — please log in again',
  'token expired': 'Your session has expired — please log in again',
  'not verified': 'Please verify your email before continuing',
  'account inactive': 'Your account has been deactivated',
  // API keys
  'api key not found': 'API key not found',
  'api key already revoked': 'This API key has already been revoked',
  // Translation
  'no text detected': 'No text was detected in the image',
  'unsupported language': 'That language is not supported',
  'file too large': `Image is too large — maximum size is 10 MB`,
  'invalid file type': 'Unsupported file type — use JPEG, PNG, or WebP',
  // Rate limiting
  'rate limit exceeded':
    'Too many requests — please wait a moment and try again',
  'quota exceeded':
    'Monthly translation quota reached — upgrade your plan for more',
  // Generic
  'internal server error': 'Something went wrong on our end — please try again',
  'service unavailable':
    'The service is temporarily unavailable — please try again shortly',
  'network error': 'Could not reach the server — check your connection',
};

/**
 * Extracts a user-friendly error message from an Axios error or any unknown error.
 * Falls back to the provided `fallback` string if no specific message is found.
 */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const raw =
      (typeof data?.detail === 'string' ? data.detail : null) ||
      (typeof data?.message === 'string' ? data.message : null) ||
      (typeof data?.error === 'string' ? data.error : null) ||
      error.message ||
      '';

    if (!raw) return fallback;

    // Check for a known mapping (case-insensitive substring match)
    const lower = raw.toLowerCase();
    for (const [key, friendly] of Object.entries(ERROR_MAP)) {
      if (lower.includes(key)) return friendly;
    }

    // 4xx errors: show the raw message (likely a meaningful validation message)
    const status = error.response?.status ?? 0;
    if (status >= 400 && status < 500 && raw.length < 200) return raw;

    return fallback;
  }

  if (error instanceof Error) return error.message || fallback;

  return fallback;
}
