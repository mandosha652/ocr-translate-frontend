'use client';

import {
  CheckCircle2,
  Download,
  Eye,
  ImageIcon,
  Loader2,
  Maximize2,
  Pencil,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { getLangName } from '@/components/features/history/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useRetryAllFailed,
  useRetryBatchImage,
  useUpdateCaption,
} from '@/hooks';
import { translateApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import type { ImageResult, TranslationOutput } from '@/types';

type RetryImageMutation = ReturnType<typeof useRetryBatchImage>;
type RetryAllFailedMutation = ReturnType<typeof useRetryAllFailed>;
type UpdateCaptionMutation = ReturnType<typeof useUpdateCaption>;

interface BatchResultsTableProps {
  images: ImageResult[];
  targetLanguages: string[];
  sourceLanguage?: string;
  batchId: string;
  retryImageHook?: RetryImageMutation;
  retryAllFailedHook?: RetryAllFailedMutation;
  updateCaptionHook?: UpdateCaptionMutation;
  onExport?: (batchId: string) => void;
  onResizeAll?: (onSuccess: (allIds: string[]) => void) => void;
  onResizeSingle?: (translationId: string, onSuccess: () => void) => void;
  resizing?: boolean;
  hideActions?: boolean;
}

/* ── Lightbox (full preview + caption edit) ──────────────── */

function ImageLightbox({
  src,
  alt,
  caption,
  open,
  onOpenChange,
  onSaveCaption,
  onRerun: _onRerun,
}: {
  src: string;
  alt: string;
  caption?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveCaption?: (text: string) => void;
  onRerun?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-4xl sm:rounded-2xl">
        <DialogHeader className="border-b border-black/6 bg-black/2 px-6 pt-4 pb-3.5 dark:border-white/8 dark:bg-white/3">
          <DialogTitle className="truncate text-sm font-semibold">
            {alt}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full-size preview
          </DialogDescription>
        </DialogHeader>

        <div className="w-full bg-black/5 dark:bg-black/40">
          <img
            src={src}
            alt={alt}
            className="block max-h-[70vh] w-full object-contain"
          />
        </div>

        {/* Caption section */}
        <div className="border-t border-black/6 bg-black/2 px-6 py-4 dark:border-white/8 dark:bg-white/3">
          {onSaveCaption ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Pencil className="h-3 w-3 text-[#0A84FF]" />
                <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                  Caption — click to edit
                </span>
              </div>
              <EditableCaption value={caption ?? ''} onSave={onSaveCaption} />
            </div>
          ) : caption ? (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {caption}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic dark:text-gray-600">
              No caption
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Editable Caption ────────────────────────────────────── */

function EditableCaption({
  value,
  onSave,
}: {
  value: string;
  onSave: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBlur = useCallback(() => {
    setEditing(false);
    const trimmed = text.trim();
    if (trimmed !== value) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onSave(trimmed), 500);
    }
  }, [text, value, onSave]);

  if (editing) {
    return (
      <textarea
        className="bg-background focus:ring-primary/40 w-full resize-none rounded-lg border px-3 py-2 text-sm leading-relaxed shadow-sm transition-shadow focus:ring-2 focus:outline-none"
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            (e.target as HTMLTextAreaElement).blur();
          }
          if (e.key === 'Escape') {
            setText(value);
            setEditing(false);
          }
        }}
        rows={3}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => {
        setText(value);
        setEditing(true);
      }}
      className="group/edit hover:bg-muted/60 hover:border-border flex w-full cursor-text items-start gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm leading-relaxed transition-all"
      title="Click to edit caption"
    >
      <span className="text-foreground/80 line-clamp-4 flex-1">
        {value || (
          <span className="text-muted-foreground/50 italic">
            Click here to add a caption...
          </span>
        )}
      </span>
      <Pencil className="text-muted-foreground/0 group-hover/edit:text-muted-foreground/50 mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors" />
    </button>
  );
}

/* ── Translation Tile ────────────────────────────────────── */

async function downloadSingleImage(url: string, lang: string) {
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  const blob = await res.blob();
  const ext = blob.type.includes('png') ? 'png' : 'jpg';
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = `${lang}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}

function TranslationTile({
  translation,
  imageId,
  batchId,
  onImageClick,
  retryImage,
  onResize,
  resizing,
  isResized,
  onRerun,
}: {
  translation: TranslationOutput;
  imageId: string;
  batchId: string;
  onImageClick: (
    src: string,
    alt: string,
    caption?: string,
    imageId?: string,
    lang?: string,
    onRerun?: () => void
  ) => void;
  retryImage: RetryImageMutation;
  onResize?: (translationId: string, onSuccess: () => void) => void;
  resizing?: boolean;
  isResized?: boolean;
  onRerun?: () => void;
}) {
  const langName = getLangName(translation.target_lang);

  if (translation.status === 'pending' || translation.status === 'processing') {
    return (
      <div className="flex aspect-[4/3] w-full animate-pulse flex-col items-center justify-center gap-2 rounded-xl bg-[#0A84FF]/8 dark:bg-[#0A84FF]/10">
        <Loader2 className="h-5 w-5 animate-spin text-[#0A84FF]" />
        <span className="text-muted-foreground text-[11px] font-medium">
          Translating...
        </span>
      </div>
    );
  }

  if (translation.status === 'failed') {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2.5 rounded-xl bg-[#FF453A]/8 dark:bg-[#FF453A]/10">
        <XCircle className="h-5 w-5 text-[#FF453A]" />
        <span className="text-[11px] font-medium text-[#FF453A]">Failed</span>
        <button
          className="flex items-center gap-1 rounded-full border border-[#FF453A]/25 bg-[#FF453A]/10 px-3 py-1 text-[11px] font-medium text-[#FF453A] transition-colors hover:bg-[#FF453A]/18"
          onClick={() => retryImage.mutate({ batchId, imageId })}
          disabled={retryImage.isPending}
        >
          {retryImage.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Retry
        </button>
      </div>
    );
  }

  const imgUrl = translation.translated_image_url
    ? getImageUrl(translation.translated_image_url)
    : null;

  return (
    <div className="group/tile">
      {imgUrl ? (
        <button
          onClick={() =>
            onImageClick(
              imgUrl,
              `${langName} translation`,
              translation.translated_caption ?? undefined,
              imageId,
              translation.target_lang,
              onRerun
            )
          }
          className="group/thumb hover:ring-primary/30 dark:hover:ring-primary/30 relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-2 dark:ring-white/10"
        >
          <Image
            src={imgUrl}
            alt={`${langName} translation`}
            fill
            className="object-cover transition-transform duration-200 group-hover/thumb:scale-[1.03]"
            unoptimized
            loading="lazy"
            sizes="180px"
          />
          {/* Hover overlay with clear action hint */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/0 transition-all duration-200 group-hover/thumb:bg-black/30">
            <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover/thumb:opacity-100 dark:bg-black/70">
              <Eye className="h-3.5 w-3.5 text-gray-800 dark:text-white" />
              <span className="text-[11px] font-medium text-gray-800 dark:text-white">
                Preview & Edit
              </span>
            </div>
          </div>
        </button>
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#30D158]/8 dark:bg-[#30D158]/10">
          <CheckCircle2 className="h-6 w-6 text-[#30D158]/50" />
        </div>
      )}
      {translation.status === 'completed' &&
      translation.translated_image_url ? (
        <div className="mt-2 flex items-center gap-1">
          {/* Download */}
          <button
            title="Download"
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-black/4 py-1.5 text-[10px] font-medium text-gray-500 transition-all hover:bg-black/8 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
            onClick={e => {
              e.stopPropagation();
              void downloadSingleImage(
                translation.translated_image_url!,
                translation.target_lang
              );
            }}
          >
            <Download className="h-2.5 w-2.5" />
            Download
          </button>
          {/* Resize */}
          {onResize ? (
            isResized ? (
              <div
                title="Resized to 1080×1350"
                className="flex h-[29px] items-center justify-center rounded-lg bg-[#30D158]/10 px-2 text-[10px] font-medium text-[#1a8c3a] dark:bg-[#30D158]/15 dark:text-[#30D158]"
              >
                <CheckCircle2 className="h-2.5 w-2.5" />
              </div>
            ) : (
              <button
                title="Resize to 1080×1350"
                className="flex h-[29px] items-center justify-center rounded-lg bg-black/4 px-2 text-[10px] font-medium text-gray-500 transition-all hover:bg-black/8 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
                onClick={e => {
                  e.stopPropagation();
                  onResize(translation.translation_id, () => {});
                }}
                disabled={resizing}
              >
                {resizing ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <Maximize2 className="h-2.5 w-2.5" />
                )}
              </button>
            )
          ) : null}
          {/* Re-run */}
          {onRerun ? (
            <button
              title="Re-run translation"
              className="flex h-[29px] items-center justify-center rounded-lg bg-black/4 px-2 text-[10px] font-medium text-gray-500 transition-all hover:bg-black/8 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-200"
              onClick={e => {
                e.stopPropagation();
                onRerun();
              }}
            >
              <RefreshCw className="h-2.5 w-2.5" />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/* ── CSV Export ───────────────────────────────────────────── */

async function downloadCSV(batchId: string) {
  try {
    const blob = await translateApi.exportBatchCSV(batchId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-${batchId}-results.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Export started');
  } catch {
    toast.error('Failed to export CSV');
  }
}

/* ── Header Actions ──────────────────────────────────────── */

function ResultsHeaderActions({
  failedCount,
  hideActions,
  allResized,
  resizing,
  batchId,
  retryAllFailed,
  onResizeAll,
  onExport,
  setResizedIds,
}: {
  failedCount: number;
  hideActions?: boolean;
  allResized: boolean;
  resizing?: boolean;
  batchId: string;
  retryAllFailed: ReturnType<typeof useRetryAllFailed>;
  onResizeAll?: BatchResultsTableProps['onResizeAll'];
  onExport?: BatchResultsTableProps['onExport'];
  setResizedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {failedCount > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 rounded-full border border-[#FF453A]/20 bg-[#FF453A]/6 text-xs font-medium text-[#cc2218] hover:bg-[#FF453A]/12 dark:border-[#FF453A]/20 dark:bg-[#FF453A]/10 dark:text-[#FF453A] dark:hover:bg-[#FF453A]/18"
          onClick={() =>
            retryAllFailed.mutate(batchId, {
              onSuccess: () => toast.success('Retrying failed images...'),
              onError: () => toast.error('Failed to retry'),
            })
          }
          disabled={retryAllFailed.isPending}
        >
          {retryAllFailed.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3" />
          )}
          Retry Failed
        </Button>
      ) : null}
      {!hideActions && onResizeAll ? (
        <Button
          variant="ghost"
          size="sm"
          className={
            allResized
              ? 'h-7 gap-1.5 rounded-full border border-[#30D158]/20 bg-[#30D158]/10 text-xs font-medium text-[#1a8c3a] dark:border-[#30D158]/20 dark:bg-[#30D158]/15 dark:text-[#30D158]'
              : 'h-7 gap-1.5 rounded-full border border-black/10 bg-black/4 text-xs font-medium text-gray-600 hover:bg-black/8 dark:border-white/10 dark:bg-white/6 dark:text-gray-300 dark:hover:bg-white/10'
          }
          onClick={() =>
            onResizeAll(ids =>
              setResizedIds(prev => new Set([...prev, ...ids]))
            )
          }
          disabled={resizing || allResized}
        >
          {resizing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : allResized ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <Maximize2 className="h-3 w-3" />
          )}
          {allResized ? 'All Resized' : 'Resize All 1080×1350'}
        </Button>
      ) : null}
      {!hideActions ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/6 text-xs font-medium text-[#0060d1] hover:bg-[#0A84FF]/12 dark:border-[#0A84FF]/20 dark:bg-[#0A84FF]/10 dark:text-[#0A84FF] dark:hover:bg-[#0A84FF]/18"
          onClick={() => (onExport ? onExport(batchId) : downloadCSV(batchId))}
        >
          <Download className="h-3 w-3" />
          Export CSV
        </Button>
      ) : null}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export function BatchResultsTable({
  images,
  targetLanguages,
  batchId,
  retryImageHook,
  retryAllFailedHook,
  updateCaptionHook,
  onExport,
  onResizeAll,
  onResizeSingle,
  resizing,
  hideActions,
  sourceLanguage,
}: BatchResultsTableProps) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    caption?: string;
    imageId?: string;
    lang?: string;
    onRerun?: () => void;
  } | null>(null);
  const [resizedIds, setResizedIds] = useState<Set<string>>(new Set());
  const defaultRetryImage = useRetryBatchImage();
  const defaultRetryAllFailed = useRetryAllFailed();
  const defaultUpdateCaption = useUpdateCaption();

  const retryImage = retryImageHook ?? defaultRetryImage;
  const retryAllFailed = retryAllFailedHook ?? defaultRetryAllFailed;
  const updateCaption = updateCaptionHook ?? defaultUpdateCaption;

  const allCompletedTranslationIds = images.flatMap(img =>
    img.translations
      .filter(t => t.status === 'completed' && t.translated_image_url)
      .map(t => t.translation_id)
  );
  const allResized =
    allCompletedTranslationIds.length > 0 &&
    allCompletedTranslationIds.every(id => resizedIds.has(id));

  const completedCount = images.reduce(
    (acc, img) =>
      acc + img.translations.filter(t => t.status === 'completed').length,
    0
  );
  const failedCount = images.reduce(
    (acc, img) =>
      acc + img.translations.filter(t => t.status === 'failed').length,
    0
  );
  const totalTranslations = images.length * targetLanguages.length;

  const openLightbox = useCallback(
    (
      src: string,
      alt: string,
      caption?: string,
      imageId?: string,
      lang?: string,
      onRerun?: () => void
    ) => {
      setLightbox({ src, alt, caption, imageId, lang, onRerun });
    },
    []
  );

  return (
    <Card className="overflow-hidden border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
      {/* Header */}
      <CardHeader className="border-b border-black/6 bg-black/2 px-5 py-4 dark:border-white/8 dark:bg-white/3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-semibold">Results</CardTitle>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-[#0A84FF]/10 px-2 py-0.5 text-xs font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]">
                {images.length} {images.length === 1 ? 'image' : 'images'}
              </span>
              <span className="rounded-full bg-black/6 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-white/8 dark:text-gray-300">
                {targetLanguages.length}{' '}
                {targetLanguages.length === 1 ? 'language' : 'languages'}
              </span>
              {completedCount > 0 ? (
                <span className="flex items-center gap-1 rounded-full bg-[#30D158]/10 px-2 py-0.5 text-xs font-medium text-[#1a8c3a] dark:bg-[#30D158]/15 dark:text-[#30D158]">
                  <CheckCircle2 className="h-3 w-3" />
                  {completedCount}/{totalTranslations}
                </span>
              ) : null}
              {failedCount > 0 ? (
                <span className="flex items-center gap-1 rounded-full bg-[#FF453A]/10 px-2 py-0.5 text-xs font-medium text-[#cc2218] dark:bg-[#FF453A]/15 dark:text-[#FF453A]">
                  <XCircle className="h-3 w-3" />
                  {failedCount} failed
                </span>
              ) : null}
            </div>
          </div>

          <ResultsHeaderActions
            failedCount={failedCount}
            hideActions={hideActions}
            allResized={allResized}
            resizing={resizing}
            batchId={batchId}
            retryAllFailed={retryAllFailed}
            onResizeAll={onResizeAll}
            onExport={onExport}
            setResizedIds={setResizedIds}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Scrollable grid */}
        <div className="overflow-x-auto">
          <div
            className="grid min-w-fit"
            style={{
              gridTemplateColumns: `repeat(${targetLanguages.length + 1}, minmax(180px, 1fr))`,
            }}
          >
            {/* Column headers */}
            <div className="sticky top-0 z-10 border-b border-black/6 bg-black/3 px-3 py-3 dark:border-white/8 dark:bg-white/4">
              {sourceLanguage && sourceLanguage !== 'auto' ? (
                <div className="flex items-center gap-1.5">
                  <code className="rounded bg-black/8 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-gray-500 dark:bg-white/10 dark:text-gray-400">
                    {sourceLanguage}
                  </code>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    {getLangName(sourceLanguage)}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
                  Original
                </span>
              )}
            </div>
            {targetLanguages.map(lang => (
              <div
                key={lang}
                className="sticky top-0 z-10 border-b border-black/6 bg-black/3 px-3 py-3 text-center dark:border-white/8 dark:bg-white/4"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <code className="rounded bg-[#0A84FF]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]">
                    {lang}
                  </code>
                  <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">
                    {getLangName(lang)}
                  </span>
                </div>
              </div>
            ))}

            {/* Image rows */}
            {images.map((image, i) => {
              const filename = image.original_filename || `Image ${i + 1}`;
              const originalSrc = image.original_image_url
                ? getImageUrl(image.original_image_url)
                : null;

              return [
                /* Original column */
                <div
                  key={`orig-${image.image_id}`}
                  className={`border-b border-black/4 px-3 py-3 dark:border-white/5 ${i % 2 === 1 ? 'bg-black/2 dark:bg-white/2' : ''}`}
                >
                  {originalSrc ? (
                    <button
                      onClick={() =>
                        openLightbox(
                          originalSrc,
                          filename,
                          image.caption ?? undefined
                        )
                      }
                      className="group/orig relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/5 transition-all hover:shadow-lg hover:ring-2 hover:ring-[#0A84FF]/30 dark:ring-white/10 dark:hover:ring-[#0A84FF]/40"
                    >
                      <Image
                        src={originalSrc}
                        alt={filename}
                        fill
                        className="object-cover transition-transform duration-200 group-hover/orig:scale-[1.03]"
                        unoptimized
                        loading="lazy"
                        sizes="180px"
                      />
                      {/* Filename badge */}
                      <div className="absolute top-2 left-2">
                        <span className="rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow backdrop-blur-sm">
                          {i + 1}
                        </span>
                      </div>
                      {/* Filename overlay at bottom */}
                      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-5 pb-2">
                        <span className="block truncate text-[11px] font-medium text-white drop-shadow">
                          {filename}
                        </span>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover/orig:bg-black/20">
                        <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-200 group-hover/orig:opacity-100 dark:bg-black/70">
                          <Eye className="h-3.5 w-3.5 text-gray-800 dark:text-white" />
                          <span className="text-[11px] font-medium text-gray-800 dark:text-white">
                            View Original
                          </span>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-black/4 dark:bg-white/4">
                      <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </div>,

                /* Translation columns */
                ...targetLanguages.map(lang => {
                  const translation = image.translations.find(
                    t => t.target_lang === lang
                  );
                  return (
                    <div
                      key={`${image.image_id}-${lang}`}
                      className={`border-b border-black/4 px-3 py-3 dark:border-white/5 ${i % 2 === 1 ? 'bg-black/2 dark:bg-white/2' : ''}`}
                    >
                      {translation ? (
                        <TranslationTile
                          translation={translation}
                          imageId={image.image_id}
                          batchId={batchId}
                          onImageClick={openLightbox}
                          retryImage={retryImage}
                          onResize={
                            onResizeSingle
                              ? (translationId, onSuccess) =>
                                  onResizeSingle(translationId, () => {
                                    setResizedIds(
                                      prev => new Set([...prev, translationId])
                                    );
                                    onSuccess();
                                  })
                              : undefined
                          }
                          resizing={resizing}
                          isResized={resizedIds.has(translation.translation_id)}
                          onRerun={() =>
                            retryImage.mutate({
                              batchId,
                              imageId: image.image_id,
                            })
                          }
                        />
                      ) : (
                        <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-black/3 dark:bg-white/3">
                          <span className="text-xs text-gray-300 dark:text-gray-600">
                            —
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }),
              ];
            })}
          </div>
        </div>
      </CardContent>

      {/* Lightbox */}
      {lightbox ? (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          caption={lightbox.caption}
          open={!!lightbox}
          onOpenChange={open => !open && setLightbox(null)}
          onRerun={lightbox.onRerun}
          onSaveCaption={
            lightbox.imageId && lightbox.lang
              ? caption =>
                  updateCaption.mutate(
                    {
                      batchId,
                      imageId: lightbox.imageId!,
                      lang: lightbox.lang!,
                      caption,
                    },
                    {
                      onSuccess: () => toast.success('Caption saved'),
                      onError: () => toast.error('Failed to save caption'),
                    }
                  )
              : undefined
          }
        />
      ) : null}
    </Card>
  );
}
