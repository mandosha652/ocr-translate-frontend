import { MAX_BATCH_SIZE } from '@/lib/constants';
import { isValidHttpUrl } from '@/lib/utils';

export function useUrlInput(
  urls: string[],
  onChange: (urls: string[]) => void
) {
  const handleChange = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    onChange(next);
  };

  const handleAdd = () => {
    if (urls.length < MAX_BATCH_SIZE) {
      onChange([...urls, '']);
    }
  };

  const handleRemove = (index: number) => {
    if (urls.length === 1) {
      onChange(['']);
    } else {
      onChange(urls.filter((_, i) => i !== index));
    }
  };

  const validCount = urls.filter(
    u => u.trim() && isValidHttpUrl(u.trim())
  ).length;

  const canAddMore = urls.length < MAX_BATCH_SIZE;

  return {
    handleChange,
    handleAdd,
    handleRemove,
    validCount,
    canAddMore,
  };
}
