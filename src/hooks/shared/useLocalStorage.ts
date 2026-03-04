'use client';

import { useCallback, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (value: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStored(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Non-critical — localStorage write failed
      }
    },
    [key]
  );

  return [stored, setValue];
}
