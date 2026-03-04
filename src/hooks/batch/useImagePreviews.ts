'use client';

import { useCallback, useEffect, useState } from 'react';

function getFileKey(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

export function useImagePreviews(selectedFiles: File[]) {
  const [previews, setPreviews] = useState<Map<string, string>>(new Map());

  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadPreviews = async () => {
      const newPreviews = new Map<string, string>();
      for (const file of selectedFiles) {
        if (cancelled) break;
        const key = getFileKey(file);
        const preview = await generatePreview(file);
        if (cancelled) break;
        newPreviews.set(key, preview);
      }
      if (!cancelled) {
        setPreviews(newPreviews);
      }
    };
    loadPreviews();

    return () => {
      cancelled = true;
    };
  }, [selectedFiles, generatePreview]);

  const clearPreviews = useCallback(() => {
    setPreviews(new Map());
  }, []);

  return { previews, clearPreviews };
}
