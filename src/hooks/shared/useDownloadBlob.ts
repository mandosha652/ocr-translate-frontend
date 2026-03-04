'use client';

import { useCallback, useState } from 'react';

import { downloadBlob } from '@/lib/utils/blob';

export function useDownloadBlob() {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = useCallback(async (url: string, filename: string) => {
    setIsDownloading(true);
    try {
      await downloadBlob(url, filename);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return { download, isDownloading };
}
