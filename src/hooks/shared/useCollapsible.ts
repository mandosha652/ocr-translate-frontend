'use client';

import { useCallback, useState } from 'react';

export function useCollapsible(initial = false) {
  const [expanded, setExpanded] = useState(initial);
  const toggle = useCallback(() => setExpanded(v => !v), []);
  return { expanded, toggle };
}
