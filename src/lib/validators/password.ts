import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(options);

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const STRENGTH_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'Very weak', color: 'bg-destructive' },
  1: { label: 'Weak', color: 'bg-destructive' },
  2: { label: 'Fair', color: 'bg-amber-500' },
  3: { label: 'Good', color: 'bg-blue-500' },
  4: { label: 'Strong', color: 'bg-green-500' },
};

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '', color: '' };
  const result = zxcvbn(password);
  const { label, color } = STRENGTH_MAP[result.score] ?? STRENGTH_MAP[0];
  return { score: result.score + 1, label, color };
}
