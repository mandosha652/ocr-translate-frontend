'use client';

import JSZip from 'jszip';
import {
  CheckCircle2,
  Download,
  FileText,
  Images,
  Languages,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
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

function SingleImageDownloads({
  completedTranslations,
  isZipping,
  downloadingLang,
  onDownloadZip,
  onDownloadLang,
}: {
  completedTranslations: TranslationItem[];
  isZipping: boolean;
  downloadingLang: string | null;
  onDownloadZip: () => void;
  onDownloadLang: (url: string, lang: string) => void;
}) {
  if (completedTranslations.length === 0) return null;

  return (
    <div className="space-y-2">
      {completedTranslations.length > 1 && (
        <Button
          onClick={onDownloadZip}
          disabled={isZipping || downloadingLang !== null}
          className="h-11 w-full rounded-xl bg-[#0A84FF] text-sm font-semibold text-white shadow-md shadow-[#0A84FF]/30 hover:bg-[#0071e3]"
          size="lg"
        >
          <Download className="h-4 w-4" />
          {isZipping
            ? 'Preparing ZIP...'
            : `Download All (${completedTranslations.length} languages)`}
        </Button>
      )}

      <div
        className={cn(
          'grid gap-2',
          completedTranslations.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        {completedTranslations.map(t => (
          <button
            key={t.target_lang}
            onClick={() =>
              onDownloadLang(t.translated_image_url!, t.target_lang)
            }
            disabled={isZipping || downloadingLang !== null}
            className={cn(
              'flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50',
              completedTranslations.length === 1
                ? 'border-transparent bg-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/30 hover:bg-[#0071e3]'
                : 'border-black/8 bg-black/3 text-gray-700 hover:border-black/15 hover:bg-black/6 dark:border-white/8 dark:bg-white/4 dark:text-gray-200 dark:hover:border-white/15 dark:hover:bg-white/8'
            )}
          >
            <Download className="h-4 w-4" />
            {downloadingLang === t.target_lang
              ? 'Downloading...'
              : langName(t.target_lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiImageDownloads({
  completedTranslations,
  isZipping,
  canExportCsv,
  csvPending,
  onExportCsv,
  onDownloadZip,
}: {
  completedTranslations: TranslationItem[];
  isZipping: boolean;
  canExportCsv: boolean;
  csvPending: boolean;
  onExportCsv: () => void;
  onDownloadZip: () => void;
}) {
  return (
    <div className="space-y-2">
      <Button
        onClick={onExportCsv}
        disabled={!canExportCsv || csvPending}
        className={cn(
          'h-11 w-full rounded-xl text-sm font-semibold transition-all',
          canExportCsv
            ? 'bg-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/30 hover:bg-[#0071e3]'
            : 'cursor-not-allowed bg-black/6 text-gray-400 dark:bg-white/6 dark:text-gray-500'
        )}
        size="lg"
      >
        <FileText className="h-4 w-4" />
        {csvPending ? 'Preparing CSV...' : 'Download Results CSV'}
      </Button>

      {completedTranslations.length > 0 && (
        <button
          onClick={onDownloadZip}
          disabled={isZipping || csvPending}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/8 bg-black/3 text-sm font-semibold text-gray-600 transition-all hover:border-black/15 hover:bg-black/6 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/8 dark:bg-white/4 dark:text-gray-300 dark:hover:border-white/15 dark:hover:bg-white/8"
        >
          <Download className="h-4 w-4" />
          {isZipping
            ? 'Preparing ZIP...'
            : `Download All Images (${completedTranslations.length} files)`}
        </button>
      )}

      {!canExportCsv && (
        <p className="text-muted-foreground text-center text-xs">
          Waiting for captions to finish...
        </p>
      )}
    </div>
  );
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

  const isSingle = batch.total_images === 1;
  const isPartial = batch.status === 'partially_completed';

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
  const canExportCsv =
    ['completed', 'partially_completed'].includes(batch.status) &&
    batch.captions_status === 'completed';

  const completedTranslations = (batch.images ?? []).flatMap(img =>
    img.translations.filter(
      t => t.status === 'completed' && t.translated_image_url
    )
  );

  async function handleDownloadZip() {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        completedTranslations.map(async t => {
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
          <CheckCircle2 className="h-3.5 w-3.5 text-[#30D158]" />
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

      <div className="space-y-4 p-5">
        {/* Stats — only shown for multi-image batches or when there are failures */}
        {(!isSingle || batch.failed_count > 0) && (
          <div className="grid grid-cols-3 divide-x divide-black/6 rounded-xl bg-black/3 dark:divide-white/8 dark:bg-white/4">
            <div className="flex flex-col items-center gap-1.5 py-4">
              <Images className="h-3.5 w-3.5 text-[#0A84FF]" />
              <span className="text-xl font-bold tabular-nums">
                {batch.total_images}
              </span>
              <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                {batch.total_images === 1 ? 'image' : 'images'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 py-4">
              <Languages className="h-3.5 w-3.5 text-[#0A84FF]" />
              <span className="text-xl font-bold tabular-nums">
                {batch.target_languages.length}
              </span>
              <span className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                {batch.target_languages.length === 1 ? 'language' : 'languages'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1.5 py-4">
              {batch.failed_count > 0 ? (
                <>
                  <XCircle className="h-3.5 w-3.5 text-[#FF453A]" />
                  <span className="text-xl font-bold text-[#FF453A] tabular-nums">
                    {batch.failed_count}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide text-[#FF453A]/70 uppercase">
                    failed
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#30D158]" />
                  <span className="text-xl font-bold text-[#30D158] tabular-nums">
                    {completedTranslations.length}
                  </span>
                  <span className="text-[10px] font-medium tracking-wide text-[#30D158]/60 uppercase">
                    ready
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {isSingle ? (
          <SingleImageDownloads
            completedTranslations={completedTranslations}
            isZipping={isZipping}
            downloadingLang={downloadingLang}
            onDownloadZip={handleDownloadZip}
            onDownloadLang={handleDownloadLang}
          />
        ) : (
          <MultiImageDownloads
            completedTranslations={completedTranslations}
            isZipping={isZipping}
            canExportCsv={canExportCsv}
            csvPending={csvPending}
            onExportCsv={() => exportCsv()}
            onDownloadZip={handleDownloadZip}
          />
        )}
      </div>
    </div>
  );
}
