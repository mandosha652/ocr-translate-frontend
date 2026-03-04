export const TIER_STYLES: Record<string, string> = {
  free: 'border-border text-muted-foreground',
  pro: 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  enterprise:
    'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
};

export const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
];

export function avatarColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++)
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function fmt(val: number | null | undefined): string {
  if (val == null) return '—';
  return `$${val.toFixed(4)}`;
}

export const ADMIN_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  pending: { label: 'Pending', color: 'text-amber-600' },
  processing: { label: 'Processing', color: 'text-blue-600' },
  completed: { label: 'Completed', color: 'text-green-600' },
  partially_completed: { label: 'Partial', color: 'text-amber-600' },
  failed: { label: 'Failed', color: 'text-destructive' },
  cancelled: { label: 'Cancelled', color: 'text-muted-foreground' },
};

export const ADMIN_BATCH_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: 'Pending',
    className:
      'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
    dot: 'bg-yellow-500',
  },
  processing: {
    label: 'Processing',
    className:
      'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    dot: 'bg-blue-500 animate-pulse',
  },
  completed: {
    label: 'Completed',
    className:
      'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  partially_completed: {
    label: 'Partial',
    className:
      'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  failed: {
    label: 'Failed',
    className:
      'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-400',
    dot: 'bg-red-500',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'border-border text-muted-foreground',
    dot: 'bg-muted-foreground/30',
  },
};

export const ADMIN_IMAGE_STATUS_CONFIG: Record<
  string,
  { className: string; dot: string }
> = {
  pending: {
    className: 'border-yellow-300 text-yellow-600',
    dot: 'bg-yellow-500',
  },
  processing: {
    className: 'border-blue-300 text-blue-600',
    dot: 'bg-blue-500 animate-pulse',
  },
  completed: {
    className: 'border-emerald-300 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  failed: {
    className: 'border-red-300 text-red-600',
    dot: 'bg-red-500',
  },
};
