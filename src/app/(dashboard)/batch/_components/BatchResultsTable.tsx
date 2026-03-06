'use client';

import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  CheckCircle2,
  Download,
  ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
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
import type {
  BatchStatusResponse,
  ImageResult,
  TranslationOutput,
} from '@/types';

interface BatchResultsTableProps {
  batch: BatchStatusResponse;
  batchId: string;
}

const columnHelper = createColumnHelper<ImageResult>();

/* ── Lightbox ─────────────────────────────────────────────── */

function ImageLightbox({
  src,
  alt,
  open,
  onOpenChange,
}: {
  src: string;
  alt: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl sm:rounded-2xl">
        <DialogHeader className="px-6 pt-5 pb-0">
          <DialogTitle className="truncate text-base font-medium">
            {alt}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Full-size preview
          </DialogDescription>
        </DialogHeader>
        <div className="relative aspect-4/3 w-full">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            unoptimized
            sizes="(max-width: 768px) 100vw, 672px"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Editable Caption ─────────────────────────────────────── */

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
        className="bg-muted/50 focus:ring-primary/40 w-full resize-none rounded-lg border-0 px-2.5 py-1.5 text-[13px] leading-snug ring-1 ring-transparent transition-shadow ring-inset focus:outline-none"
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
        rows={2}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group/edit flex w-full cursor-text items-start gap-1 text-left text-[13px] leading-snug transition-colors"
      title="Click to edit"
    >
      <span className="text-foreground/80 line-clamp-2 flex-1">
        {value || (
          <span className="text-muted-foreground/60 italic">No caption</span>
        )}
      </span>
      <Pencil className="text-muted-foreground/0 group-hover/edit:text-muted-foreground/50 mt-0.5 h-3 w-3 shrink-0 transition-colors" />
    </button>
  );
}

/* ── Language Cell ─────────────────────────────────────────── */

function LanguageCell({
  translation,
  imageId,
  batchId,
  onImageClick,
}: {
  translation: TranslationOutput | undefined;
  imageId: string;
  batchId: string;
  onImageClick: (src: string, alt: string) => void;
}) {
  const retryImage = useRetryBatchImage();
  const updateCaption = useUpdateCaption();

  if (!translation) {
    return (
      <div className="flex h-full items-center justify-center py-3">
        <span className="text-muted-foreground/40 text-xs">--</span>
      </div>
    );
  }

  if (translation.status === 'pending' || translation.status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 py-4">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
          <Loader2 className="text-primary h-4 w-4 animate-spin" />
        </div>
        <span className="text-muted-foreground text-[11px]">Processing</span>
      </div>
    );
  }

  if (translation.status === 'failed') {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-4 w-4" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 rounded-lg px-2.5 text-[11px]"
          onClick={() => retryImage.mutate({ batchId, imageId })}
          disabled={retryImage.isPending}
        >
          {retryImage.isPending ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 h-3 w-3" />
          )}
          Retry
        </Button>
      </div>
    );
  }

  const imgUrl = translation.translated_image_url
    ? getImageUrl(translation.translated_image_url)
    : null;

  return (
    <div className="flex gap-2.5 py-1">
      {imgUrl ? (
        <button
          onClick={() =>
            onImageClick(
              imgUrl,
              `${getLangName(translation.target_lang)} translation`
            )
          }
          className="group/thumb bg-muted relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-lg ring-1 ring-black/5 transition-shadow hover:shadow-md dark:ring-white/10"
        >
          <Image
            src={imgUrl}
            alt={`${translation.target_lang} translation`}
            fill
            className="object-cover transition-transform group-hover/thumb:scale-105"
            unoptimized
            loading="lazy"
            sizes="44px"
          />
        </button>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <EditableCaption
          value={translation.translated_caption ?? ''}
          onSave={caption =>
            updateCaption.mutate(
              { batchId, imageId, lang: translation.target_lang, caption },
              {
                onSuccess: () => toast.success('Caption saved'),
                onError: () => toast.error('Failed to save caption'),
              }
            )
          }
        />
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <span className="text-muted-foreground/60 text-[11px]">Done</span>
        </div>
      </div>
    </div>
  );
}

/* ── CSV Export ────────────────────────────────────────────── */

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

/* ── Table Body (opted out of React Compiler — useReactTable returns unmemoizable fns) */

function ResultsTableBody({
  data,
  columns,
}: {
  data: ImageResult[];
  columns: ColumnDef<ImageResult, unknown>[];
}) {
  'use no memo';

  // eslint-disable-next-line react-hooks/incompatible-library -- opted out via "use no memo"
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-150">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="text-muted-foreground/70 px-4 py-2.5 text-left text-[11px] font-medium tracking-wide uppercase"
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`hover:bg-muted/40 transition-colors ${
                i < table.getRowModel().rows.length - 1
                  ? 'border-border/50 border-b'
                  : ''
              }`}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-4 py-3 align-top"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main Table ───────────────────────────────────────────── */

export function BatchResultsTable({ batch, batchId }: BatchResultsTableProps) {
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const retryAllFailed = useRetryAllFailed();

  const completedCount = batch.images.reduce(
    (acc, img) =>
      acc + img.translations.filter(t => t.status === 'completed').length,
    0
  );
  const failedCount = batch.images.reduce(
    (acc, img) =>
      acc + img.translations.filter(t => t.status === 'failed').length,
    0
  );

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const columns = useMemo(() => {
    const cols = [
      columnHelper.display({
        id: 'index',
        header: '#',
        size: 44,
        cell: info => (
          <span className="text-muted-foreground/60 text-[13px] tabular-nums">
            {info.row.index + 1}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'original',
        header: 'Original',
        size: 72,
        cell: info => {
          const img = info.row.original;
          const src = img.original_image_url
            ? getImageUrl(img.original_image_url)
            : null;
          return src ? (
            <button
              onClick={() => openLightbox(src, img.original_filename)}
              className="group/orig bg-muted relative h-11 w-11 cursor-pointer overflow-hidden rounded-lg ring-1 ring-black/5 transition-shadow hover:shadow-md dark:ring-white/10"
            >
              <Image
                src={src}
                alt={img.original_filename}
                fill
                className="object-cover transition-transform group-hover/orig:scale-105"
                unoptimized
                loading="lazy"
                sizes="44px"
              />
            </button>
          ) : (
            <div className="bg-muted/60 flex h-11 w-11 items-center justify-center rounded-lg">
              <ImageIcon className="text-muted-foreground/40 h-4 w-4" />
            </div>
          );
        },
      }),
      columnHelper.accessor('caption', {
        header: 'Caption',
        size: 200,
        cell: info => {
          const val = info.getValue();
          return (
            <p
              className="line-clamp-2 max-w-50 text-[13px] leading-snug"
              title={val ?? undefined}
            >
              {val || (
                <span className="text-muted-foreground/50 italic">
                  No caption
                </span>
              )}
            </p>
          );
        },
      }),
      ...batch.target_languages.map(lang =>
        columnHelper.display({
          id: `lang_${lang}`,
          header: () => (
            <span className="whitespace-nowrap">{getLangName(lang)}</span>
          ),
          size: 200,
          cell: info => {
            const img = info.row.original;
            const translation = img.translations.find(
              t => t.target_lang === lang
            );
            return (
              <LanguageCell
                translation={translation}
                imageId={img.image_id}
                batchId={batchId}
                onImageClick={openLightbox}
              />
            );
          },
        })
      ),
    ];
    return cols;
  }, [batch.target_languages, batchId, openLightbox]);

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <CardHeader className="pb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">Results</CardTitle>
            <div className="text-muted-foreground flex items-center gap-2 text-[13px]">
              <span>{batch.images.length} images</span>
              <span className="text-muted-foreground/30">/</span>
              <span>{batch.target_languages.length} languages</span>
              {completedCount > 0 ? (
                <>
                  <span className="text-muted-foreground/30">/</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {completedCount}
                  </span>
                </>
              ) : null}
              {failedCount > 0 ? (
                <>
                  <span className="text-muted-foreground/30">/</span>
                  <span className="text-destructive flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    {failedCount}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {failedCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-[13px]"
                onClick={() =>
                  retryAllFailed.mutate(batchId, {
                    onSuccess: () => toast.success('Retrying failed images...'),
                    onError: () => toast.error('Failed to retry'),
                  })
                }
                disabled={retryAllFailed.isPending}
              >
                {retryAllFailed.isPending ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                )}
                Retry Failed
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-[13px]"
              onClick={() => downloadCSV(batchId)}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Table */}
      <CardContent className="px-0 pb-0">
        <ResultsTableBody
          data={batch.images}
          columns={columns as ColumnDef<ImageResult, unknown>[]}
        />
      </CardContent>

      {/* Lightbox */}
      {lightbox ? (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          open={!!lightbox}
          onOpenChange={open => !open && setLightbox(null)}
        />
      ) : null}
    </Card>
  );
}
