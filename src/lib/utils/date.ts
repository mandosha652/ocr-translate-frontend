import {
  differenceInDays,
  format,
  formatDistanceToNowStrict,
  isPast,
  isToday,
  isTomorrow,
  isYesterday,
} from 'date-fns';

export function formatLastActive(iso: string | null): string {
  if (!iso) return 'No activity yet';
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  const distance = formatDistanceToNowStrict(date, { addSuffix: true });
  if (!distance.includes('month') && !distance.includes('year'))
    return distance;
  return format(date, 'MMM d, yyyy');
}

export function formatLastUsed(iso: string | null): string {
  if (!iso) return 'Never used';
  return `Used ${formatDistanceToNowStrict(new Date(iso), { addSuffix: true })}`;
}

export function formatExpiry(iso: string | null): {
  label: string;
  urgent: boolean;
} | null {
  if (!iso) return null;
  const expiry = new Date(iso);
  if (isPast(expiry)) return { label: 'Expired', urgent: true };
  if (isTomorrow(expiry)) return { label: 'Expires tomorrow', urgent: true };
  const daysLeft = differenceInDays(expiry, new Date());
  if (daysLeft <= 30)
    return { label: `Expires in ${daysLeft} days`, urgent: daysLeft <= 7 };
  return { label: `Expires ${format(expiry, 'MMM d, yyyy')}`, urgent: false };
}
