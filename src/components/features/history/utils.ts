import { format, formatDistanceToNow, isAfter, subDays } from 'date-fns';

import { SUPPORTED_LANGUAGES } from '@/types';

export { downloadFile } from '@/lib/utils/blob';

export function getLangName(code: string) {
  return SUPPORTED_LANGUAGES.find(l => l.code === code)?.name ?? code;
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (isAfter(date, subDays(new Date(), 7))) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return format(date, 'MMM d');
}
