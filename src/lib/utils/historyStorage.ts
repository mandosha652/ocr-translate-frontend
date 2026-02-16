import type { TranslateResponse, BatchStatusResponse } from '@/types';

export interface HistoryItem {
  id: string;
  type: 'single' | 'batch';
  timestamp: string;
  targetLang?: string;
  targetLanguages?: string[];
  result?: TranslateResponse;
  batchResult?: BatchStatusResponse; // Only used for type compatibility, batches fetched from backend
}

const HISTORY_KEY = 'translation_history';
const MAX_HISTORY_ITEMS = 50;

export const historyStorage = {
  getHistory: (): HistoryItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSingleTranslation: (
    result: TranslateResponse,
    targetLang: string
  ): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = historyStorage.getHistory();
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

  clearHistory: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  },

  deleteItem: (id: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const history = historyStorage.getHistory();
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  },
};
