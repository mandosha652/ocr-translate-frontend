import type { TranslateResponse } from '@/types';

export interface HistoryItem {
  id: string;
  type: 'single';
  timestamp: string;
  targetLang: string;
  result: TranslateResponse;
}

const HISTORY_KEY = 'translation_history';
const MAX_HISTORY_ITEMS = 50;

function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export const historyStorage = {
  addSingleTranslation: (
    result: TranslateResponse,
    targetLang: string
  ): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = getHistory();
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        type: 'single',
        timestamp: new Date().toISOString(),
        targetLang,
        result,
      };
      const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save translation to history:', error);
    }
  },
};
