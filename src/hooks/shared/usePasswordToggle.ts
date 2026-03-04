'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useCallback, useState } from 'react';

export function usePasswordToggle() {
  const [show, setShow] = useState(false);
  const toggle = useCallback(() => setShow(v => !v), []);
  const inputType = show ? 'text' : 'password';
  const Icon = show ? EyeOff : Eye;
  return { show, toggle, inputType, Icon };
}
