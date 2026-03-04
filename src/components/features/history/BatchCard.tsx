'use client';

import { useId, useState } from 'react';
import { toast } from 'sonner';

import { useCollapsible } from '@/hooks/shared/useCollapsible';
import { getImageUrl } from '@/lib/utils';
import { downloadBlob } from '@/lib/utils/blob';
import type { BatchStatusResponse } from '@/types';

import { BatchCardDetails } from './BatchCardDetails';
import { BatchCardHeader } from './BatchCardHeader';

interface BatchCardProps {
  batch: BatchStatusResponse;
}

export function BatchCard({ batch }: BatchCardProps) {
  const { expanded, toggle } = useCollapsible();
  const panelId = useId();
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    const completedImages = batch.images.filter(i => i.status === 'completed');
    const all = completedImages.flatMap(img =>
      img.translations
        .filter(t => t.status === 'completed' && t.translated_image_url)
        .map(t => ({
          url: getImageUrl(t.translated_image_url!),
          filename: `${img.original_filename.replace(/\.[^.]+$/, '')}_${t.target_lang}.png`,
        }))
    );
    if (!all.length) {
      toast.error('Nothing to download');
      return;
    }

    setIsZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      await Promise.all(
        all.map(async ({ url, filename }) => {
          const res = await fetch(url);
          zip.file(filename, await res.blob());
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = URL.createObjectURL(blob);
      await downloadBlob(blobUrl, `batch-${batch.batch_id.slice(0, 8)}.zip`);
      URL.revokeObjectURL(blobUrl);
      toast.success(`Downloaded ${all.length} images`);
    } catch {
      toast.error('ZIP failed — try downloading individually');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-sm">
      <BatchCardHeader
        batch={batch}
        expanded={expanded}
        panelId={panelId}
        onToggle={toggle}
        onDownloadAll={handleDownloadAll}
        isZipping={isZipping}
      />
      {expanded && (
        <div id={panelId} className="space-y-5 border-t px-4 pt-3 pb-4">
          <BatchCardDetails batch={batch} batchId={batch.batch_id} />
        </div>
      )}
    </div>
  );
}
