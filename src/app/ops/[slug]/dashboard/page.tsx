'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  HelpCircle,
  ImageIcon,
  Info,
  Languages,
  Link2,
  Loader2,
  LogOut,
  Send,
  Sparkles,
  Upload,
  UploadCloud,
  XCircle,
  Zap,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

import { BatchResultsTable } from '@/app/(dashboard)/batch/_components/BatchResultsTable';
import { BatchStatusCard } from '@/components/features/ops/BatchStatusCard';
import { CsvDropzone } from '@/components/features/ops/CsvDropzone';
import {
  CsvPreview,
  validateCsvFile,
} from '@/components/features/ops/CsvPreview';
import { DownloadResultsCard } from '@/components/features/ops/DownloadResultsCard';
import { FailedImagesCard } from '@/components/features/ops/FailedImagesCard';
import { TeamAuthGate } from '@/components/features/ops/TeamAuthGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/ui/Logo';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useTeamBatches,
  useTeamBatchStatus,
  useTeamCancelBatch,
  useTeamExportCsv,
  useTeamLogout,
  useTeamQuickTranslate,
  useTeamResizeTranslations,
  useTeamRetryAllFailed,
  useTeamRetryImage,
  useTeamUpdateCaption,
  useTeamUploadCsv,
} from '@/hooks/useTeam';
import { TEAM_SLUG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { TeamBatchStatus } from '@/types';
import { langName, SUPPORTED_LANGUAGES } from '@/types/language';

/* ── CSV Template ─────────────────────────────────────────── */

const CSV_TEMPLATE =
  'image_url,caption,source_lang,target_langs\nhttps://example.com/image1.jpg,"Product title here",en,de;fr\nhttps://example.com/image2.png,"Another caption",auto,es;it;pt\n';

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'imgtext-batch-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Status helpers ───────────────────────────────────────── */

/* Apple iOS system colors:
   Blue   #0A84FF  — processing / info
   Green  #30D158  — completed / success
   Orange #FF9F0A  — pending / partial / warning
   Red    #FF453A  — failed / error
   Gray   #636366  — cancelled / muted
*/
const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  pending: {
    bg: 'bg-[#FF9F0A]/12 dark:bg-[#FF9F0A]/15',
    text: 'text-[#b86e00] dark:text-[#FF9F0A]',
    dot: 'bg-[#FF9F0A]',
    label: 'Pending',
  },
  processing: {
    bg: 'bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15',
    text: 'text-[#0060d1] dark:text-[#0A84FF]',
    dot: 'bg-[#0A84FF]',
    label: 'Processing',
  },
  completed: {
    bg: 'bg-[#30D158]/10 dark:bg-[#30D158]/15',
    text: 'text-[#1a8c3a] dark:text-[#30D158]',
    dot: 'bg-[#30D158]',
    label: 'Completed',
  },
  partially_completed: {
    bg: 'bg-[#FF9F0A]/12 dark:bg-[#FF9F0A]/15',
    text: 'text-[#b86e00] dark:text-[#FF9F0A]',
    dot: 'bg-[#FF9F0A]',
    label: 'Partial',
  },
  failed: {
    bg: 'bg-[#FF453A]/10 dark:bg-[#FF453A]/15',
    text: 'text-[#cc2218] dark:text-[#FF453A]',
    dot: 'bg-[#FF453A]',
    label: 'Failed',
  },
  cancelled: {
    bg: 'bg-black/5 dark:bg-white/8',
    text: 'text-gray-500 dark:text-gray-400',
    dot: 'bg-gray-400',
    label: 'Cancelled',
  },
};

function StatusPill({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? {
    bg: 'bg-black/5 dark:bg-white/8',
    text: 'text-gray-500 dark:text-gray-400',
    dot: 'bg-gray-400',
    label: status,
  };
  const isLive = status === 'processing';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        cfg.bg,
        cfg.text
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        {isLive ? (
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              cfg.dot
            )}
          />
        ) : null}
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            cfg.dot
          )}
        />
      </span>
      {cfg.label}
    </span>
  );
}

/* ── Tooltip helper ───────────────────────────────────────── */

function Hint({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="text-muted-foreground/50 hover:text-muted-foreground h-3.5 w-3.5 cursor-help transition-colors" />
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-56 text-center text-xs leading-relaxed"
      >
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

/* ── Step indicator ───────────────────────────────────────── */

function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A84FF] text-[10px] font-bold text-white shadow-sm shadow-[#0A84FF]/30">
        {n}
      </span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </div>
  );
}

function SubmitButtonContent({ isPending }: { isPending: boolean }) {
  if (isPending) {
    return (
      <span className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Submitting translation...
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2">
      <Send className="h-4 w-4" />
      Translate Image
      <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
    </span>
  );
}

/* ── Quick Translate Tab ─────────────────────────────────── */

function LangPicker({
  targetLangs,
  onToggle,
  onSelectAll,
  onClearAll,
}: {
  targetLangs: string[];
  onToggle: (code: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}) {
  const allSelected = targetLangs.length === SUPPORTED_LANGUAGES.length;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SUPPORTED_LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => onToggle(l.code)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-150',
              targetLangs.includes(l.code)
                ? 'border-transparent bg-[#0A84FF] text-white shadow-sm shadow-[#0A84FF]/20'
                : 'border-black/10 text-gray-500 hover:border-black/20 hover:bg-black/4 hover:text-gray-800 dark:border-white/10 dark:text-gray-400 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white'
            )}
          >
            {l.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[11px] font-medium text-[#0A84FF] hover:underline"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
        {!allSelected && targetLangs.length > 0 && (
          <>
            <span className="text-[11px] text-gray-300 dark:text-gray-600">
              ·
            </span>
            <button
              onClick={onClearAll}
              className="text-[11px] font-medium text-gray-400 hover:text-gray-600 hover:underline dark:hover:text-gray-200"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function QuickTranslatePreview({
  previewUrl,
  urlImgError,
  onUrlImgError,
  sourceLang,
  targetLangs,
  file,
  caption,
}: {
  previewUrl: string | null;
  urlImgError: boolean;
  onUrlImgError: () => void;
  sourceLang: string;
  targetLangs: string[];
  file: File | null;
  caption: string;
}) {
  return (
    <div className="lg:col-span-2">
      <div className="sticky top-6">
        <div className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
          {previewUrl ? (
            <>
              <div className="relative flex w-full items-center justify-center bg-[#0D0D0F]">
                {urlImgError ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <AlertCircle className="h-6 w-6 text-[#FF453A]/60" />
                    <p className="text-xs font-medium text-[#FF453A]">
                      Can&apos;t load image
                    </p>
                    <p className="max-w-40 text-[11px] text-gray-400">
                      URL may be private, blocked by CORS, or invalid
                    </p>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="block h-auto max-h-[380px] w-auto max-w-full object-contain"
                    onError={onUrlImgError}
                  />
                )}
                {sourceLang !== 'auto' && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                      {langName(sourceLang)}
                    </span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-black/5 dark:divide-white/6">
                {file ? (
                  <div className="flex items-center justify-between gap-2 px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <ImageIcon className="h-3 w-3 shrink-0 text-gray-400" />
                      <span className="truncate text-xs font-medium">
                        {file.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground shrink-0 text-[11px] tabular-nums">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>
                ) : null}

                {targetLangs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
                    <Languages className="h-3 w-3 shrink-0 text-gray-400" />
                    <span className="text-muted-foreground text-[11px]">→</span>
                    {targetLangs.map(code => (
                      <span
                        key={code}
                        className="rounded-full bg-[#0A84FF]/10 px-2 py-0.5 text-[11px] font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]"
                      >
                        {langName(code)}
                      </span>
                    ))}
                  </div>
                )}

                {caption ? (
                  <div className="px-4 py-2.5">
                    <p className="text-muted-foreground mb-1 text-[10px] font-semibold">
                      Caption
                    </p>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                      {caption}
                    </p>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5">
                <ImageIcon className="text-muted-foreground/30 h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">Image preview</p>
                <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                  Upload a file or paste a URL
                  <br />
                  to see a preview here
                </p>
              </div>
              {targetLangs.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {targetLangs.map(code => (
                    <span
                      key={code}
                      className="rounded-full bg-[#0A84FF]/10 px-2 py-0.5 text-[11px] font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]"
                    >
                      {langName(code)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type QuickInputMode = 'upload' | 'url';

function QuickTranslateTab({
  onBatchCreated,
}: {
  onBatchCreated: (batchId: string) => void;
}) {
  const [inputMode, setInputMode] = useState<QuickInputMode>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLangs, setTargetLangs] = useState<string[]>(['de']);
  const [excludeText, setExcludeText] = useState('');
  const [removeLogo, setRemoveLogo] = useState(false);
  const { mutate: quickTranslate, isPending } = useTeamQuickTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlImgError, setUrlImgError] = useState(false);

  const preview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const toggleLang = (code: string) => {
    setTargetLangs(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };
  const selectAllLangs = () =>
    setTargetLangs(SUPPORTED_LANGUAGES.map(l => l.code));
  const clearAllLangs = () => setTargetLangs([]);

  const canSubmit =
    !isPending &&
    targetLangs.length > 0 &&
    (inputMode === 'upload' ? !!file : imageUrl.trim().startsWith('http'));

  const handleSubmit = () => {
    quickTranslate(
      {
        file: inputMode === 'upload' ? (file ?? undefined) : undefined,
        imageUrl: inputMode === 'url' ? imageUrl.trim() : undefined,
        caption: caption.trim() || undefined,
        sourceLang,
        targetLangs,
        excludeText: excludeText.trim() || undefined,
        removeLogo,
      },
      {
        onSuccess: data => {
          toast.success('Translation started — check Batches tab for status');
          onBatchCreated(data.batch_id);
          setFile(null);
          setImageUrl('');
          setCaption('');
          setExcludeText('');
          setRemoveLogo(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        onError: () => {
          toast.error('Failed to start translation');
        },
      }
    );
  };

  const previewUrl =
    inputMode === 'url' && imageUrl.trim().startsWith('http')
      ? imageUrl.trim()
      : preview;

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* Left: Form */}
      <div className="space-y-4 lg:col-span-3">
        {/* Step 1 — Image */}
        <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
          <div className="mb-4 flex items-center justify-between">
            <StepBadge n={1} label="Image" />
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <div className="flex rounded-lg border border-black/8 p-0.5 dark:border-white/10">
                <button
                  onClick={() => setInputMode('upload')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
                    inputMode === 'upload'
                      ? 'bg-[#0A84FF] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  <Upload className="h-3 w-3" />
                  Upload
                </button>
                <button
                  onClick={() => setInputMode('url')}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all',
                    inputMode === 'url'
                      ? 'bg-[#0A84FF] text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
                  )}
                >
                  <Link2 className="h-3 w-3" />
                  URL
                </button>
              </div>
              <Hint text="Upload a JPEG, PNG, or WebP file from your computer, or paste a public image URL." />
            </div>
          </div>

          {inputMode === 'upload' ? (
            <label
              htmlFor="quick-file"
              className={cn(
                'group flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all duration-200',
                file
                  ? 'border-[#0A84FF]/30 bg-[#0A84FF]/4 dark:bg-[#0A84FF]/8'
                  : 'border-black/8 hover:border-[#0A84FF]/30 hover:bg-[#0A84FF]/3 dark:border-white/10 dark:hover:border-[#0A84FF]/30 dark:hover:bg-[#0A84FF]/6'
              )}
            >
              {file ? (
                <div className="flex w-full items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15">
                    <CheckCircle2 className="h-4 w-4 text-[#0A84FF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {file.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {(file.size / 1024 / 1024).toFixed(1)} MB · click to
                      replace
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/5 transition-all group-hover:bg-[#0A84FF]/10 dark:bg-white/5 dark:group-hover:bg-[#0A84FF]/15">
                    <Upload className="h-4 w-4 text-gray-400 transition-colors group-hover:text-[#0A84FF]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">
                      Drop image or click to browse
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      JPEG · PNG · WebP · max 10 MB
                    </p>
                  </div>
                </>
              )}
              <input
                id="quick-file"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="space-y-1.5">
              <Input
                id="quick-url"
                placeholder="https://example.com/product-image.jpg"
                value={imageUrl}
                onChange={e => {
                  setImageUrl(e.target.value);
                  setUrlImgError(false);
                }}
                className="h-10 rounded-xl text-sm"
              />
              <p className="text-muted-foreground text-[11px]">
                Must be a publicly accessible URL starting with https://
              </p>
            </div>
          )}
        </div>

        {/* Step 2 — Languages */}
        <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
          <div className="mb-4 flex items-center justify-between">
            <StepBadge n={2} label="Languages" />
            <Hint text="Source is the language in the image — auto-detect works in most cases. Target languages are what the image text will be translated into." />
          </div>

          {/* Source */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Source language
            </p>
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger className="h-8 w-40 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#0A84FF]" />
                    Auto-detect
                  </span>
                </SelectItem>
                {SUPPORTED_LANGUAGES.map(l => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="h-px bg-black/5 dark:bg-white/6" />

          {/* Targets */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Translate into
              </p>
              {targetLangs.length > 0 && (
                <span className="rounded-full bg-[#0A84FF]/10 px-2 py-0.5 text-[11px] font-semibold text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]">
                  {targetLangs.length} selected
                </span>
              )}
            </div>
            <LangPicker
              targetLangs={targetLangs}
              onToggle={toggleLang}
              onSelectAll={selectAllLangs}
              onClearAll={clearAllLangs}
            />
            {targetLangs.length === 0 && (
              <p className="flex items-center gap-1 text-xs text-[#FF453A]">
                <AlertCircle className="h-3 w-3" />
                Pick at least one target language
              </p>
            )}
          </div>
        </div>

        {/* Step 3 — Optional extras */}
        <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
          <div className="mb-4 flex items-center justify-between">
            <StepBadge n={3} label="Extras (optional)" />
            <Hint text="Caption is extra text translated alongside the image. Exclude skips specific words like brand names. Logo removal erases watermarks." />
          </div>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Caption{' '}
                <span className="font-normal text-gray-400 dark:text-gray-500">
                  — extra text to translate alongside
                </span>
              </Label>
              <textarea
                id="quick-caption"
                className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-3.5 py-2.5 text-sm shadow-sm transition-all focus-visible:ring-1 focus-visible:outline-none"
                placeholder="e.g. Summer collection — fresh styles for every occasion"
                rows={2}
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Protect from translation
                  </Label>
                  {excludeText.trim() && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {excludeText.split(',').filter(k => k.trim()).length}{' '}
                      keyword
                      {excludeText.split(',').filter(k => k.trim()).length !== 1
                        ? 's'
                        : ''}{' '}
                      protected
                    </span>
                  )}
                </div>
                <Input
                  placeholder="Nike, tinygardenhabit, www.brand.com"
                  value={excludeText}
                  onChange={e => setExcludeText(e.target.value)}
                  className="h-9 rounded-xl text-sm"
                />
                {excludeText.trim() ? (
                  <div className="flex flex-wrap gap-1">
                    {excludeText
                      .split(',')
                      .filter(k => k.trim())
                      .map(kw => (
                        <span
                          key={kw.trim()}
                          className="inline-flex items-center rounded-md bg-[#0A84FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]"
                        >
                          {kw.trim()}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Text regions containing these keywords won&apos;t be
                    translated. Comma-separate multiple.
                  </p>
                )}
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-black/8 bg-black/2 px-3 py-2.5 transition-colors hover:bg-black/4 dark:border-white/8 dark:bg-white/3 dark:hover:bg-white/5">
                <input
                  type="checkbox"
                  checked={removeLogo}
                  onChange={e => setRemoveLogo(e.target.checked)}
                  className="h-4 w-4 accent-[#0A84FF]"
                />
                <div>
                  <span className="text-xs font-medium">
                    Remove logos &amp; watermarks
                  </span>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    Erase brand marks from the image before translating
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          className={cn(
            'h-12 w-full rounded-xl text-sm font-semibold transition-all',
            canSubmit
              ? 'bg-[#0A84FF] text-white shadow-md shadow-[#0A84FF]/30 hover:bg-[#0071e3]'
              : 'cursor-not-allowed opacity-40'
          )}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <SubmitButtonContent isPending={isPending} />
        </Button>
      </div>

      <QuickTranslatePreview
        previewUrl={previewUrl}
        urlImgError={urlImgError}
        onUrlImgError={() => setUrlImgError(true)}
        sourceLang={sourceLang}
        targetLangs={targetLangs}
        file={file}
        caption={caption}
      />
    </div>
  );
}

/* ── New Batch Tab ───────────────────────────────────────── */

function NewBatchTab({
  onBatchCreated,
}: {
  onBatchCreated: (batchId: string) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvValid, setCsvValid] = useState(false);
  const [excludeText, setExcludeText] = useState('');
  const [removeLogo, setRemoveLogo] = useState(false);
  const { mutate: upload, isPending: uploading } = useTeamUploadCsv();

  const handleFileSelected = useCallback(async (file: File) => {
    setCsvValid(false);
    setSelectedFile(file);
    const valid = await validateCsvFile(file);
    setCsvValid(valid);
  }, []);

  const handleUpload = () => {
    if (!selectedFile) return;
    upload(
      {
        file: selectedFile,
        excludeText: excludeText.trim() || undefined,
        removeLogo,
      },
      {
        onSuccess: data => {
          toast.success(`Batch created — ${data.image_count} images queued`);
          onBatchCreated(data.batch_id);
          setSelectedFile(null);
          setCsvValid(false);
          setExcludeText('');
          setRemoveLogo(false);
        },
        onError: () => {
          toast.error('Upload failed. Check your CSV format and try again.');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* How it works */}
      <details className="group rounded-2xl border border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-5 select-none">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500">
            <Info className="h-3 w-3" />
            How it works
          </p>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400 transition-transform group-open:rotate-90" />
        </summary>
        <div className="px-5 pb-5">
          <div className="relative grid grid-cols-3 gap-3">
            {/* Connector lines */}
            <div className="absolute top-3.5 right-1/3 left-1/3 h-px bg-black/8 dark:bg-white/10" />
            {[
              {
                step: '1',
                title: 'Prepare CSV',
                desc: 'Download the template, fill in image URLs and captions',
              },
              {
                step: '2',
                title: 'Upload CSV',
                desc: 'Drop your file below — we validate it instantly',
              },
              {
                step: '3',
                title: 'Download results',
                desc: 'We translate everything and send back a CSV',
              },
            ].map(item => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#0A84FF] text-[11px] font-bold text-white shadow-sm ring-4 shadow-[#0A84FF]/30 ring-white dark:ring-[#1C1C1E]">
                  {item.step}
                </div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">
                  {item.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </details>

      {/* Upload card */}
      <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0A84FF]/10 dark:bg-[#0A84FF]/15">
              <FileSpreadsheet className="h-4 w-4 text-[#0A84FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Upload CSV</p>
              <p className="text-muted-foreground text-xs">
                image_url · caption · source_lang · target_langs
              </p>
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadTemplate}
                className="h-8 gap-1.5 rounded-full border border-[#0A84FF]/20 bg-[#0A84FF]/6 text-xs font-medium text-[#0060d1] hover:bg-[#0A84FF]/12 dark:border-[#0A84FF]/20 dark:bg-[#0A84FF]/10 dark:text-[#0A84FF] dark:hover:bg-[#0A84FF]/18"
              >
                <Download className="h-3 w-3" />
                Get template
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Download a pre-filled CSV template to get started quickly
            </TooltipContent>
          </Tooltip>
        </div>

        <CsvDropzone
          file={selectedFile}
          onFile={handleFileSelected}
          disabled={uploading}
        />

        {/* Options */}
        <div className="mt-4 space-y-3">
          <div className="h-px bg-black/5 dark:bg-white/6" />
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Options
          </p>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Protect from translation
                </Label>
                {excludeText.trim() && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {excludeText.split(',').filter(k => k.trim()).length}{' '}
                    keyword
                    {excludeText.split(',').filter(k => k.trim()).length !== 1
                      ? 's'
                      : ''}{' '}
                    protected
                  </span>
                )}
              </div>
              <Input
                placeholder="Nike, tinygardenhabit, www.brand.com"
                value={excludeText}
                onChange={e => setExcludeText(e.target.value)}
                disabled={uploading}
                className="h-9 rounded-xl text-sm"
              />
              {excludeText.trim() ? (
                <div className="flex flex-wrap gap-1">
                  {excludeText
                    .split(',')
                    .filter(k => k.trim())
                    .map(kw => (
                      <span
                        key={kw.trim()}
                        className="inline-flex items-center rounded-md bg-[#0A84FF]/10 px-2 py-0.5 text-[10px] font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Text regions containing these keywords won&apos;t be
                  translated. Comma-separate multiple.
                </p>
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-black/8 bg-black/2 px-3 py-2.5 transition-colors hover:bg-black/4 dark:border-white/8 dark:bg-white/3 dark:hover:bg-white/5">
              <input
                type="checkbox"
                checked={removeLogo}
                onChange={e => setRemoveLogo(e.target.checked)}
                disabled={uploading}
                className="h-4 w-4 accent-[#0A84FF]"
              />
              <div>
                <span className="text-xs font-medium">
                  Remove logos &amp; watermarks
                </span>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                  Erase brand marks from the image before translating
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Language codes reference */}
        <details className="group mt-4" open suppressHydrationWarning>
          <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors select-none hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
            Language code reference
          </summary>
          <div className="mt-3 rounded-xl border border-black/5 bg-black/2 p-3 dark:border-white/6 dark:bg-white/3">
            <div className="grid grid-cols-4 gap-x-4 gap-y-2.5 text-xs">
              {/* auto — special */}
              <div className="flex items-center gap-2">
                <code className="rounded-md bg-[#FF9F0A]/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#b86e00] dark:bg-[#FF9F0A]/15 dark:text-[#FF9F0A]">
                  auto
                </code>
                <span className="text-gray-500 dark:text-gray-400">
                  Auto-detect
                </span>
              </div>
              {SUPPORTED_LANGUAGES.map(lang => (
                <div key={lang.code} className="flex items-center gap-2">
                  <code className="rounded-md bg-[#0A84FF]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF]">
                    {lang.code}
                  </code>
                  <span className="text-gray-600 dark:text-gray-300">
                    {lang.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </details>

        {selectedFile ? (
          <div className="mt-4">
            <CsvPreview
              file={selectedFile}
              onFileChange={updated => {
                setSelectedFile(updated);
                validateCsvFile(updated).then(setCsvValid);
              }}
            />
          </div>
        ) : null}

        <Button
          className={cn(
            'mt-5 h-12 w-full rounded-xl text-sm font-semibold shadow-sm transition-all',
            selectedFile && csvValid && !uploading
              ? 'bg-[#0A84FF] text-white shadow-sm shadow-[#0A84FF]/25 hover:bg-[#0071e3]'
              : 'cursor-not-allowed bg-black/6 text-gray-400 dark:bg-white/6 dark:text-gray-500'
          )}
          disabled={!selectedFile || !csvValid || uploading}
          onClick={handleUpload}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing CSV...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4" />
              Submit Batch
              <ArrowRight className="ml-auto h-4 w-4 opacity-50" />
            </span>
          )}
        </Button>

        {selectedFile && !csvValid ? (
          <p className="text-muted-foreground mt-3 text-center text-xs">
            Fix the errors above before submitting
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ── Batch Row side card ─────────────────────────────────── */

function BatchRowSideCard({
  batch,
  batchIsDone,
  batchIsActive,
  cancelling,
  onCancel,
}: {
  batch: TeamBatchStatus;
  batchIsDone: boolean;
  batchIsActive: boolean;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const retryImageHook = useTeamRetryImage();
  const retryAllFailedHook = useTeamRetryAllFailed();
  const isRetrying = retryImageHook.isPending || retryAllFailedHook.isPending;

  if (batchIsDone) return <DownloadResultsCard batch={batch} />;

  // Keep failed card visible while retry is in-flight (status briefly goes back to processing)
  const hasFailed =
    (batch.images?.some(img => img.status === 'failed') ?? false) ||
    batch.failed_count > 0;
  if (hasFailed || isRetrying) {
    return (
      <FailedImagesCard
        images={batch.images ?? []}
        batchId={batch.batch_id}
        onRetryImage={(batchId, imageId) =>
          retryImageHook.mutate({ batchId, imageId })
        }
        onRetryAll={batchId => retryAllFailedHook.mutate(batchId)}
        retrying={isRetrying}
      />
    );
  }
  if (!batchIsActive) return null;
  return (
    <Card className="flex flex-col items-center justify-center border-black/6 bg-white shadow-sm dark:border-white/8 dark:bg-[#1C1C1E]">
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-ping rounded-full bg-[#0A84FF]/10" />
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/8">
            <Loader2 className="h-5 w-5 animate-spin text-[#0A84FF]" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Translating...</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Your images are being processed. This usually takes a few minutes.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-1 h-8 rounded-full border border-[#FF453A]/20 text-xs text-[#FF453A] hover:bg-[#FF453A]/8 dark:border-[#FF453A]/30 dark:hover:bg-[#FF453A]/10"
          onClick={onCancel}
          disabled={cancelling}
        >
          {cancelling ? (
            <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
          ) : (
            <XCircle className="mr-1.5 h-3 w-3" />
          )}
          Cancel batch
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Batch Row (expandable) ──────────────────────────────── */

function BatchRow({
  batchId,
  isExpanded,
  onToggle,
}: {
  batchId: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { data: batch } = useTeamBatchStatus(batchId);
  const { mutate: cancelBatch, isPending: cancelling } = useTeamCancelBatch();
  const { mutate: exportCsv } = useTeamExportCsv(batchId);
  const retryImageHook = useTeamRetryImage();
  const retryAllFailedHook = useTeamRetryAllFailed();
  const updateCaptionHook = useTeamUpdateCaption();
  const resizeMutation = useTeamResizeTranslations();

  if (!batch) {
    return (
      <div className="overflow-hidden rounded-2xl border border-black/6 dark:border-white/8">
        <div className="flex items-center gap-3 bg-white px-4 py-3.5 dark:bg-[#1C1C1E]">
          <div className="h-7 w-7 animate-pulse rounded-full bg-black/6 dark:bg-white/8" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-28 animate-pulse rounded bg-black/6 dark:bg-white/8" />
            <div className="h-2.5 w-44 animate-pulse rounded bg-black/5 dark:bg-white/6" />
          </div>
        </div>
      </div>
    );
  }

  const batchIsDone =
    ['completed', 'partially_completed'].includes(batch.status) &&
    batch.captions_status === 'completed';
  const batchIsActive = ['pending', 'processing'].includes(batch.status);
  const imagesPct =
    batch.total_images > 0
      ? Math.round((batch.completed_count / batch.total_images) * 100)
      : 0;
  const showResults = batchIsDone && (batch.images?.length ?? 0) > 0;

  const handleResizeAll = (onSuccess: (ids: string[]) => void) =>
    resizeMutation.mutate(
      { batchId: batch.batch_id, translationIds: null },
      {
        onSuccess: d => {
          const allIds = (batch.images ?? []).flatMap(img =>
            img.translations
              .filter(t => t.status === 'completed' && t.translated_image_url)
              .map(t => t.translation_id)
          );
          onSuccess(allIds);
          toast.success(`Resized ${d.resized_count} images to 1080×1350`);
        },
        onError: () => toast.error('Failed to resize images'),
      }
    );

  const handleResizeSingle = (translationId: string, onSuccess: () => void) =>
    resizeMutation.mutate(
      { batchId: batch.batch_id, translationIds: [translationId] },
      {
        onSuccess: () => {
          onSuccess();
          toast.success('Resized to 1080×1350');
        },
        onError: () => toast.error('Failed to resize'),
      }
    );

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border transition-all duration-200',
        isExpanded
          ? 'border-black/10 shadow-md dark:border-white/12'
          : 'border-black/6 hover:border-black/12 hover:shadow-sm dark:border-white/8 dark:hover:border-white/14'
      )}
    >
      {/* Summary row */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors select-none',
          isExpanded
            ? 'bg-black/3 dark:bg-white/4'
            : 'bg-white hover:bg-black/2 dark:bg-[#1C1C1E] dark:hover:bg-white/4'
        )}
      >
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors',
            isExpanded
              ? 'bg-black/8 dark:bg-white/12'
              : 'bg-black/5 dark:bg-white/8'
          )}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <code className="text-muted-foreground rounded bg-black/5 px-1.5 py-0.5 font-mono text-[11px] dark:bg-white/8">
              {batch.batch_id.slice(0, 8)}
            </code>
            <StatusPill status={batch.status} />
            <span className="text-muted-foreground/50 hidden text-[11px] sm:inline">
              {formatDistanceToNowStrict(new Date(batch.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {batch.total_images}{' '}
              {batch.total_images === 1 ? 'image' : 'images'}
            </span>
            <span className="flex items-center gap-1">
              <Languages className="h-3 w-3" />
              {batch.target_languages.map(langName).join(' · ')}
            </span>
            {batch.failed_count > 0 && (
              <span className="flex items-center gap-1 font-medium text-[#FF453A] dark:text-[#FF453A]">
                <XCircle className="h-3 w-3" />
                {batch.failed_count} failed
              </span>
            )}
          </div>
        </div>

        {/* Progress (active only) */}
        {batchIsActive ? (
          <div className="hidden w-28 shrink-0 sm:block">
            <Progress value={imagesPct} className="h-1.5" />
            <p className="text-muted-foreground mt-1 text-right text-[10px] tabular-nums">
              {batch.completed_count}/{batch.total_images}
            </p>
          </div>
        ) : null}
      </div>

      {/* Expanded detail */}
      {isExpanded ? (
        <div className="border-t border-black/6 dark:border-white/8">
          <div className="space-y-5 bg-black/2 p-5 dark:bg-white/2">
            <div className="grid gap-4 sm:grid-cols-2">
              <BatchStatusCard batch={batch} />

              <BatchRowSideCard
                batch={batch}
                batchIsDone={batchIsDone}
                batchIsActive={batchIsActive}
                cancelling={cancelling}
                onCancel={() =>
                  cancelBatch(batch.batch_id, {
                    onSuccess: () => toast.success('Batch cancelled'),
                    onError: () => toast.error('Failed to cancel'),
                  })
                }
              />
            </div>

            {showResults ? (
              <BatchResultsTable
                key={batch.batch_id}
                images={batch.images!}
                targetLanguages={batch.target_languages}
                sourceLanguage={(() => {
                  if (
                    batch.source_language &&
                    batch.source_language !== 'auto'
                  ) {
                    return batch.source_language;
                  }
                  const detected = [
                    ...new Set(
                      (batch.images ?? [])
                        .map(img => img.detected_source_language)
                        .filter(Boolean)
                    ),
                  ];
                  return detected.length === 1 ? detected[0]! : undefined;
                })()}
                batchId={batch.batch_id}
                retryImageHook={retryImageHook}
                retryAllFailedHook={retryAllFailedHook}
                updateCaptionHook={updateCaptionHook}
                onExport={() => exportCsv()}
                resizing={resizeMutation.isPending}
                onResizeAll={handleResizeAll}
                onResizeSingle={handleResizeSingle}
                hideActions={batch.total_images === 1}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Batches Tab ─────────────────────────────────────────── */

function BatchesTab({
  expandedBatchId,
  onExpandBatch,
}: {
  expandedBatchId: string | null;
  onExpandBatch: (id: string | null) => void;
}) {
  const { data: batchList, isPending: loading, isError } = useTeamBatches();
  const [visibleCount, setVisibleCount] = useState(10);

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/8 px-4 py-3.5 dark:border-[#FF453A]/25 dark:bg-[#FF453A]/10">
        <AlertCircle className="h-4.5 w-4.5 shrink-0 text-[#FF453A]" />
        <p className="flex-1 text-sm text-[#cc2218] dark:text-[#FF453A]">
          Failed to load batches. Check your connection.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 rounded-full text-xs"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <Loader2 className="text-muted-foreground/40 h-7 w-7 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading batches...</p>
      </div>
    );
  }

  const batches = batchList?.batches ?? [];

  if (batches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-black/5 dark:bg-white/5">
          <FileSpreadsheet className="text-muted-foreground/40 h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <p className="font-semibold">No batches yet</p>
          <p className="text-muted-foreground max-w-xs text-sm">
            Use Quick Translate or upload a CSV to create your first batch
          </p>
        </div>
      </div>
    );
  }

  const activeBatches = batches.filter(b =>
    ['pending', 'processing'].includes(b.status)
  );
  const completedBatches = batches.filter(
    b => !['pending', 'processing'].includes(b.status)
  );
  const visible = completedBatches.slice(0, visibleCount);
  const hasMore = visibleCount < completedBatches.length;

  return (
    <div className="space-y-6">
      {activeBatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A84FF] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A84FF]" />
            </span>
            <h3 className="text-sm font-semibold">
              Active
              <span className="text-muted-foreground ml-1.5 font-normal">
                ({activeBatches.length})
              </span>
            </h3>
            <Hint text="These batches are currently being processed. Click a row to see live progress." />
          </div>
          <div className="space-y-2">
            {activeBatches.map(b => (
              <BatchRow
                key={b.batch_id}
                batchId={b.batch_id}
                isExpanded={expandedBatchId === b.batch_id}
                onToggle={() =>
                  onExpandBatch(
                    expandedBatchId === b.batch_id ? null : b.batch_id
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {visible.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            History
            <span className="text-muted-foreground ml-1.5 font-normal">
              ({completedBatches.length})
            </span>
          </h3>
          <div className="space-y-2">
            {visible.map(b => (
              <BatchRow
                key={b.batch_id}
                batchId={b.batch_id}
                isExpanded={expandedBatchId === b.batch_id}
                onToggle={() =>
                  onExpandBatch(
                    expandedBatchId === b.batch_id ? null : b.batch_id
                  )
                }
              />
            ))}
          </div>
          {hasMore ? (
            <button
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1.5 py-2 text-xs transition-colors"
              onClick={() => setVisibleCount(prev => prev + 10)}
            >
              <ChevronDown className="h-3.5 w-3.5" />
              Show more ({completedBatches.length - visibleCount} remaining)
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

/* ── Tab nav item ─────────────────────────────────────────── */

type TabId = 'quick' | 'batch' | 'batches';

interface NavItem {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  tip: string;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function TeamDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  if (slug !== TEAM_SLUG) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<TabId>('quick');
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);
  const { mutate: logout, isPending: loggingOut } = useTeamLogout();

  const handleBatchCreated = useCallback((batchId: string) => {
    setActiveTab('batches');
    setExpandedBatchId(batchId);
  }, []);

  const { data: batchList } = useTeamBatches();
  const notifiedRef = useRef<Set<string>>(new Set());
  const seededRef = useRef(false);
  useEffect(() => {
    if (!batchList?.batches) return;
    // On first load, pre-seed all existing batch IDs so we don't toast for history
    if (!seededRef.current) {
      seededRef.current = true;
      for (const batch of batchList.batches) {
        notifiedRef.current.add(batch.batch_id);
      }
      return;
    }
    // On subsequent polls, only toast for newly completed batches
    for (const batch of batchList.batches) {
      if (['pending', 'processing'].includes(batch.status)) continue;
      if (notifiedRef.current.has(batch.batch_id)) continue;
      notifiedRef.current.add(batch.batch_id);
      toast.success(`Batch ${batch.batch_id.slice(0, 8)} completed`, {
        id: `batch-done-${batch.batch_id}`,
      });
    }
  }, [batchList]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'team-token' && !e.newValue) {
        window.location.href = `/ops/${TEAM_SLUG}/login`;
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const hasActiveBatches = batchList?.batches?.some(b =>
    ['pending', 'processing'].includes(b.status)
  );

  const navItems: NavItem[] = [
    {
      id: 'quick',
      icon: <Zap className="h-4 w-4" />,
      label: 'Quick Translate',
      sublabel: 'Single image',
      tip: 'Translate one image at a time — fastest way to get results',
    },
    {
      id: 'batch',
      icon: <FileSpreadsheet className="h-4 w-4" />,
      label: 'New Batch',
      sublabel: 'CSV upload',
      tip: 'Upload a CSV to translate many images at once',
    },
    {
      id: 'batches',
      icon: <Clock className="h-4 w-4" />,
      label: 'Batches',
      sublabel: 'History & results',
      tip: 'View all your batches, check status, and download results',
    },
  ];

  const tabTitles: Record<TabId, { title: string; description: string }> = {
    quick: {
      title: 'Quick Translate',
      description: 'Translate a single image with optional caption text',
    },
    batch: {
      title: 'New Batch',
      description: 'Upload a CSV file to translate many images at once',
    },
    batches: {
      title: 'Batches',
      description: 'Track all your translation jobs and download results',
    },
  };

  return (
    <TeamAuthGate>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0D0D0F]">
          {/* Top bar */}
          <header className="sticky top-0 z-40 border-b border-black/8 bg-[#F5F5F7]/80 backdrop-blur-xl dark:border-white/8 dark:bg-[#0D0D0F]/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <Logo size="md" />
                <div className="border-l pl-3">
                  <p className="text-muted-foreground text-[11px]">
                    Ops workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveBatches ? (
                  <span className="hidden items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium text-gray-600 sm:flex dark:bg-white/8 dark:text-gray-300">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A84FF] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0A84FF]" />
                    </span>
                    Processing
                  </span>
                ) : null}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => logout()}
                      disabled={loggingOut}
                      className="text-muted-foreground hover:text-foreground h-8 gap-1.5 rounded-full text-xs"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">
                        {loggingOut ? 'Signing out...' : 'Sign out'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Sign out of the ops workspace
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex gap-6 lg:gap-8">
              {/* Sidebar nav */}
              <aside className="hidden w-52 shrink-0 lg:block">
                <nav className="sticky top-24 space-y-1">
                  <p className="text-muted-foreground mb-3 px-3 text-[10px] font-semibold tracking-widest uppercase">
                    Workspace
                  </p>
                  {navItems.map(item => (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveTab(item.id)}
                          className={cn(
                            'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150',
                            activeTab === item.id
                              ? 'bg-white text-gray-900 shadow-sm dark:bg-white/10 dark:text-white'
                              : 'text-gray-500 hover:bg-black/4 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/6 dark:hover:text-gray-200'
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                              activeTab === item.id
                                ? 'bg-[#0A84FF] text-white shadow-sm'
                                : 'bg-black/5 text-gray-400 group-hover:bg-black/8 group-hover:text-gray-600 dark:bg-white/8 dark:text-gray-400 dark:group-hover:bg-white/12 dark:group-hover:text-gray-200'
                            )}
                          >
                            {item.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                              {item.id === 'batches' && hasActiveBatches ? (
                                <span className="relative flex h-2 w-2">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A84FF] opacity-75" />
                                  <span
                                    className={cn(
                                      'relative inline-flex h-2 w-2 rounded-full',
                                      activeTab === item.id
                                        ? 'bg-white/70'
                                        : 'bg-[#0A84FF]'
                                    )}
                                  />
                                </span>
                              ) : null}
                            </div>
                            <span
                              className={cn(
                                'text-[11px]',
                                activeTab === item.id
                                  ? 'text-gray-400 dark:text-gray-400'
                                  : 'text-gray-400 dark:text-gray-500'
                              )}
                            >
                              {item.sublabel}
                            </span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-44 text-xs">
                        {item.tip}
                      </TooltipContent>
                    </Tooltip>
                  ))}

                  {/* Help box */}
                  <div className="mt-6 rounded-xl border border-black/6 bg-white p-3.5 dark:border-white/8 dark:bg-[#2C2C2E]">
                    <div className="mb-2 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-[#0A84FF]" />
                      <p className="text-xs font-semibold">Quick tips</p>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                      <li className="flex gap-1.5">
                        <span className="mt-0.5 shrink-0">·</span>
                        <span>
                          Use{' '}
                          <strong className="text-gray-700 dark:text-gray-300">
                            Quick Translate
                          </strong>{' '}
                          for single images
                        </span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-0.5 shrink-0">·</span>
                        <span>
                          Use{' '}
                          <strong className="text-gray-700 dark:text-gray-300">
                            New Batch
                          </strong>{' '}
                          for bulk CSV jobs
                        </span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-0.5 shrink-0">·</span>
                        <span>
                          Download results from the{' '}
                          <strong className="text-gray-700 dark:text-gray-300">
                            Batches
                          </strong>{' '}
                          tab
                        </span>
                      </li>
                    </ul>
                  </div>
                </nav>
              </aside>

              {/* Main content */}
              <main className="min-w-0 flex-1">
                {/* Page heading */}
                <div className="mb-6">
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {tabTitles[activeTab].title}
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {tabTitles[activeTab].description}
                  </p>
                </div>

                {/* Mobile nav */}
                <div className="mb-6 flex gap-1.5 overflow-x-auto lg:hidden">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition-all',
                        activeTab === item.id
                          ? 'bg-white text-gray-900 shadow-sm dark:bg-white/12 dark:text-white'
                          : 'bg-black/5 text-gray-500 hover:bg-black/8 hover:text-gray-900 dark:bg-white/6 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      {item.icon}
                      {item.label}
                      {item.id === 'batches' && hasActiveBatches ? (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A84FF] opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0A84FF]" />
                        </span>
                      ) : null}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div>
                  {activeTab === 'quick' && (
                    <QuickTranslateTab onBatchCreated={handleBatchCreated} />
                  )}
                  {activeTab === 'batch' && (
                    <NewBatchTab onBatchCreated={handleBatchCreated} />
                  )}
                  {activeTab === 'batches' && (
                    <BatchesTab
                      expandedBatchId={expandedBatchId}
                      onExpandBatch={setExpandedBatchId}
                    />
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </TeamAuthGate>
  );
}
