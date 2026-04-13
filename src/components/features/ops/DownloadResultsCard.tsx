'use client';

import JSZip from 'jszip';
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { useTeamExportCsv } from '@/hooks/useTeam';
import { cn } from '@/lib/utils';
import type { TeamBatchStatus } from '@/types';
import { langName } from '@/types/language';

interface DownloadResultsCardProps {
  batch: TeamBatchStatus;
  className?: string;
}

async function triggerDownload(url: string, filename: string) {
  const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`);
  const blob = await res.blob();
  const ext = blob.type.includes('png') ? 'png' : 'jpg';
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `${filename}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}

interface TranslationItem {
  target_lang: string;
  translated_image_url?: string | null;
  status: string;
}

export function DownloadResultsCard({
  batch,
  className,
}: DownloadResultsCardProps) {
  const { mutate: exportCsv, isPending: csvPending } = useTeamExportCsv(
    batch.batch_id
  );
  const [isZipping, setIsZipping] = useState(false);
  const [downloadingLang, setDownloadingLang] = useState<string | null>(null);

  const isPartial = batch.status === 'partially_completed';
  const isSingle = batch.total_images === 1;

  const completedTranslations = (batch.images ?? []).flatMap(img =>
    img.translations.filter(
      t => t.status === 'completed' && t.translated_image_url
    )
  );

  const canExportCsv =
    ['completed', 'partially_completed'].includes(batch.status) &&
    batch.captions_status === 'completed';

  async function handleDownloadZip() {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        completedTranslations.map(async (t: TranslationItem) => {
          const res = await fetch(
            `/api/proxy-image?url=${encodeURIComponent(t.translated_image_url!)}`
          );
          const blob = await res.blob();
          const ext = blob.type.includes('png') ? 'png' : 'jpg';
          zip.file(`${t.target_lang}.${ext}`, blob);
        })
      );
      const content = await zip.generateAsync({ type: 'blob' });
      const objectUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `batch_${batch.batch_id.slice(0, 8)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
    } finally {
      setIsZipping(false);
    }
  }

  async function handleDownloadLang(imageUrl: string, lang: string) {
    setDownloadingLang(lang);
    try {
      await triggerDownload(imageUrl, lang);
    } finally {
      setDownloadingLang(null);
    }
  }

  const resolvedSourceLang = (() => {
    if (batch.source_language && batch.source_language !== 'auto') {
      return batch.source_language;
    }
    const detected = [
      ...new Set(
        (batch.images ?? [])
          .map(img => img.detected_source_language)
          .filter(Boolean)
      ),
    ];
    return detected.length === 1 ? detected[0]! : null;
  })();

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]',
        className
      )}
    >
      {/* Header */}
      <div className="border-b border-black/6 bg-black/2 px-5 py-3.5 dark:border-white/8 dark:bg-white/3">
        <div className="flex items-center gap-2.5">
          {isPartial ? (
            <XCircle className="h-3.5 w-3.5 text-[#FF9F0A]" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-[#30D158]" />
          )}
          <p className="text-sm font-semibold">
            {isPartial ? 'Partially completed' : 'Results ready'}
          </p>
          {resolvedSourceLang ? (
            <span className="rounded-md bg-black/5 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-white/10 dark:text-gray-400">
              {langName(resolvedSourceLang)} →
            </span>
          ) : null}
          <code className="ml-auto rounded bg-black/5 px-1.5 py-0.5 font-mono text-[11px] text-gray-500 dark:bg-white/12 dark:text-gray-300">
            {batch.batch_id.slice(0, 8)}
          </code>
        </div>
      </div>

      <div className="p-5">
        {/* Single image — compact per-language buttons */}
        {isSingle ? (
          <div className="flex flex-wrap gap-2">
            {completedTranslations.map((t: TranslationItem) => (
              <button
                key={t.target_lang}
                onClick={() =>
                  handleDownloadLang(t.translated_image_url!, t.target_lang)
                }
                disabled={isZipping || downloadingLang !== null}
                className="flex items-center gap-1.5 rounded-lg border border-black/8 bg-black/3 px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:border-black/15 hover:bg-black/6 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:bg-white/4 dark:text-gray-200 dark:hover:border-white/15 dark:hover:bg-white/8"
              >
                {downloadingLang === t.target_lang ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                {langName(t.target_lang)}
              </button>
            ))}
            {completedTranslations.length === 0 && (
              <p className="text-xs text-gray-400">No results yet</p>
            )}
          </div>
        ) : (
          /* Multi image — CSV primary, zip secondary, both compact */
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportCsv()}
              disabled={!canExportCsv || csvPending}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50',
                canExportCsv
                  ? 'border border-[#0A84FF]/20 bg-[#0A84FF]/8 text-[#0060d1] hover:bg-[#0A84FF]/14 dark:border-[#0A84FF]/20 dark:bg-[#0A84FF]/10 dark:text-[#0A84FF]'
                  : 'border border-black/8 bg-black/3 text-gray-400 dark:border-white/8 dark:bg-white/4 dark:text-gray-500'
              )}
            >
              {csvPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              {csvPending ? 'Preparing...' : 'Export CSV'}
            </button>

            {completedTranslations.length > 0 && (
              <button
                onClick={handleDownloadZip}
                disabled={isZipping || csvPending}
                className="flex items-center gap-1.5 rounded-lg border border-black/8 bg-black/3 px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:border-black/15 hover:bg-black/6 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:bg-white/4 dark:text-gray-200 dark:hover:border-white/15 dark:hover:bg-white/8"
              >
                {isZipping ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                {isZipping
                  ? 'Zipping...'
                  : `Download ZIP (${completedTranslations.length})`}
              </button>
            )}

            {!canExportCsv && (
              <p className="w-full text-[11px] text-gray-400">
                Waiting for captions...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
