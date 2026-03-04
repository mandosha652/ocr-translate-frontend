import { toast } from 'sonner';

import type { BatchStatusResponse, SingleTranslationRecord } from '@/types';

export async function downloadBlob(
  url: string,
  filename: string
): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  try {
    await downloadBlob(url, filename);
    toast.success('Download started');
  } catch {
    toast.error('Download failed');
  }
}

export function downloadHistoryJSON(
  singles: SingleTranslationRecord[],
  batches: BatchStatusResponse[]
): void {
  const data = JSON.stringify({ singles, batches }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `imgtext-history-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
