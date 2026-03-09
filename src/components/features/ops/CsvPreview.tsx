'use client';

import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Plus,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { langName, SUPPORTED_LANGUAGES } from '@/types/language';

interface CsvPreviewProps {
  file: File;
  onFileChange?: (file: File) => void;
}

interface ParsedRow {
  image_url: string;
  caption: string;
  source_lang: string;
  target_langs: string;
  [key: string]: string;
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
  rows: ParsedRow[];
  totalRows: number;
}

interface ParsedCsv {
  headers: string[];
  rows: string[][];
  delimiter: string;
}

const REQUIRED_COLUMNS = [
  'image_url',
  'caption',
  'source_lang',
  'target_langs',
];
const VALID_LANG_CODES = new Set(SUPPORTED_LANGUAGES.map(l => l.code));
const VALID_SOURCE_CODES = new Set([...VALID_LANG_CODES, 'auto']);

function detectDelimiter(headerLine: string): string {
  const candidates = [',', '\t', ';'] as const;
  let best: string = ',';
  let bestCount = 0;
  for (const d of candidates) {
    const count = headerLine.split(d).length - 1;
    if (count > bestCount) {
      bestCount = count;
      best = d;
    }
  }
  return best;
}

function parseCsv(text: string): ParsedCsv {
  // Strip BOM (Excel UTF-8 exports)
  const clean = text.replace(/^\uFEFF/, '');
  if (clean.trim().length === 0) {
    return { headers: [], rows: [], delimiter: ',' };
  }

  const firstLineEnd = clean.search(/\r?\n/);
  const headerLine = firstLineEnd === -1 ? clean : clean.slice(0, firstLineEnd);
  const delimiter = detectDelimiter(headerLine);

  // RFC 4180 compliant parser — handles quoted fields, escaped quotes,
  // multiline values, BOM, and auto-detected delimiters (comma/tab/semicolon).
  const rows: string[][] = [];
  let field = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < clean.length && clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field.trim());
      field = '';
    } else if (ch === '\r') {
      // skip \r; \n will finalize the row
    } else if (ch === '\n') {
      row.push(field.trim());
      field = '';
      if (row.some(cell => cell !== '')) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }

  // Last field / row (file may not end with newline)
  row.push(field.trim());
  if (row.some(cell => cell !== '')) rows.push(row);

  if (rows.length === 0) return { headers: [], rows: [], delimiter };

  const headers = rows[0].map(h => h.toLowerCase());
  return { headers, rows: rows.slice(1), delimiter };
}

function validate(text: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { headers, rows: rawRows, delimiter } = parseCsv(text);

  if (delimiter !== ',') {
    const name = delimiter === '\t' ? 'tab' : `"${delimiter}"`;
    warnings.push(`Detected ${name}-separated file (not comma) — parsed OK`);
  }

  if (headers.length === 0) {
    return { errors: ['CSV file is empty'], warnings, rows: [], totalRows: 0 };
  }

  const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(', ')}`);
    return { errors, warnings, rows: [], totalRows: rawRows.length };
  }

  const colIdx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const expectedCols = headers.length;
  const parsed: ParsedRow[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const rowNum = i + 2; // 1-indexed + header

    if (raw.length !== expectedCols) {
      warnings.push(
        `Row ${rowNum}: expected ${expectedCols} columns, got ${raw.length}`
      );
    }

    const row: ParsedRow = {
      image_url: raw[colIdx['image_url']] ?? '',
      caption: raw[colIdx['caption']] ?? '',
      source_lang: raw[colIdx['source_lang']] ?? '',
      target_langs: raw[colIdx['target_langs']] ?? '',
    };

    if (!row.image_url) {
      errors.push(`Row ${rowNum}: missing image_url`);
    } else if (!/^https?:\/\/.+/i.test(row.image_url)) {
      errors.push(`Row ${rowNum}: invalid image_url "${row.image_url}"`);
    }

    if (row.source_lang && !VALID_SOURCE_CODES.has(row.source_lang)) {
      errors.push(
        `Row ${rowNum}: unknown source language "${row.source_lang}"`
      );
    }

    const targets = row.target_langs
      .split(/[;|,]/)
      .map(t => t.trim())
      .filter(Boolean);
    if (targets.length === 0) {
      errors.push(`Row ${rowNum}: missing target_langs`);
    } else {
      for (const t of targets) {
        if (!VALID_LANG_CODES.has(t)) {
          errors.push(`Row ${rowNum}: unknown target language "${t}"`);
        }
      }
    }

    parsed.push(row);
  }

  if (rawRows.length === 0) {
    warnings.push('CSV has headers but no data rows');
  }

  if (rawRows.length > 100) {
    warnings.push(
      `Large batch: ${rawRows.length} rows may take a while to process`
    );
  }

  return { errors, warnings, rows: parsed, totalRows: rawRows.length };
}

function quoteField(value: string, delimiter: string): string {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes('\n')
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rebuildCsv(
  originalText: string,
  edits: Record<number, string>
): string {
  const { headers, rows, delimiter } = parseCsv(originalText);
  if (headers.length === 0) return originalText;

  const targetIdx = headers.indexOf('target_langs');
  if (targetIdx === -1) return originalText;

  const updatedRows = rows.map((row, i) => {
    if (i in edits) {
      const newRow = [...row];
      // Pad if needed
      while (newRow.length <= targetIdx) newRow.push('');
      newRow[targetIdx] = edits[i];
      return newRow;
    }
    return row;
  });

  // Use original header casing from the raw text
  const clean = originalText.replace(/^\uFEFF/, '');
  const firstLineEnd = clean.search(/\r?\n/);
  const rawHeaderLine =
    firstLineEnd === -1 ? clean : clean.slice(0, firstLineEnd);
  const rawHeaders = rawHeaderLine.split(delimiter).map(h => h.trim());

  const lines = [rawHeaders.map(h => quoteField(h, delimiter)).join(delimiter)];
  for (const row of updatedRows) {
    lines.push(row.map(cell => quoteField(cell, delimiter)).join(delimiter));
  }
  return `${lines.join('\n')}\n`;
}

function LanguageAdder({
  currentLangs,
  onAdd,
}: {
  currentLangs: string[];
  onAdd: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const available = SUPPORTED_LANGUAGES.filter(
    l => !currentLangs.includes(l.code)
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (available.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-[#0A84FF] hover:text-[#0A84FF] dark:border-gray-600 dark:text-gray-500 dark:hover:border-[#0A84FF] dark:hover:text-[#0A84FF]"
        title="Add language"
      >
        <Plus className="h-2.5 w-2.5" />
      </button>
      {open ? (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-40 w-28 overflow-y-auto rounded-lg border border-black/8 bg-white shadow-lg dark:border-white/10 dark:bg-[#2C2C2E]">
          {available.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onAdd(lang.code);
                setOpen(false);
              }}
              className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-left text-[10px] transition-colors hover:bg-black/4 dark:hover:bg-white/8"
            >
              <span className="font-mono text-[9px] text-gray-400">
                {lang.code.toUpperCase()}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CsvPreview({ file, onFileChange }: CsvPreviewProps) {
  const [text, setText] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<number, string>>({});
  const isEditable = !!onFileChange;

  // Track the original file identity to avoid re-reading after internal edits
  const originalFileRef = useRef<File | null>(null);

  useEffect(() => {
    // Skip re-read if this file was produced by our own onFileChange
    if (originalFileRef.current && file !== originalFileRef.current) {
      // A genuinely new file from outside — reset everything
      originalFileRef.current = null;
    }
    if (originalFileRef.current) return;

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = e => {
      if (!cancelled) {
        setText(e.target?.result as string);
        setEdits({});
      }
    };
    reader.readAsText(file);
    return () => {
      cancelled = true;
    };
  }, [file]);

  const workingText = useMemo(() => {
    if (!text) return null;
    if (Object.keys(edits).length === 0) return text;
    return rebuildCsv(text, edits);
  }, [text, edits]);

  const result = useMemo(
    () => (workingText ? validate(workingText) : null),
    [workingText]
  );

  const emitFileChange = useCallback(
    (newEdits: Record<number, string>) => {
      if (!text || !onFileChange) return;
      const newText = rebuildCsv(text, newEdits);
      const newFile = new File([newText], file.name, {
        type: file.type || 'text/csv',
      });
      // Mark this file so we don't re-read it in the useEffect
      originalFileRef.current = newFile;
      onFileChange(newFile);
    },
    [text, file.name, file.type, onFileChange]
  );

  const updateTargets = useCallback(
    (rowIndex: number, newTargets: string) => {
      const newEdits = { ...edits, [rowIndex]: newTargets };
      setEdits(newEdits);
      emitFileChange(newEdits);
    },
    [edits, emitFileChange]
  );

  const removeTarget = useCallback(
    (rowIndex: number, langCode: string, currentTargets: string) => {
      // Detect the delimiter used within target_langs
      const sep = currentTargets.includes(';')
        ? ';'
        : currentTargets.includes('|')
          ? '|'
          : ',';
      const langs = currentTargets
        .split(/[;|,]/)
        .map(t => t.trim())
        .filter(t => t && t !== langCode);
      updateTargets(rowIndex, langs.join(sep));
    },
    [updateTargets]
  );

  const addTarget = useCallback(
    (rowIndex: number, langCode: string, currentTargets: string) => {
      const sep = currentTargets.includes(';')
        ? ';'
        : currentTargets.includes('|')
          ? '|'
          : ',';
      const langs = currentTargets
        .split(/[;|,]/)
        .map(t => t.trim())
        .filter(Boolean);
      langs.push(langCode);
      updateTargets(rowIndex, langs.join(sep));
    },
    [updateTargets]
  );

  if (!result) return null;

  const previewRows = result.rows.slice(0, 5);
  const hasErrors = result.errors.length > 0;
  const hasEdits = Object.keys(edits).length > 0;

  return (
    <div
      className={
        hasErrors
          ? 'overflow-hidden rounded-2xl border border-[#FF453A]/20 bg-[#FF453A]/5 dark:border-[#FF453A]/20 dark:bg-[#FF453A]/8'
          : 'overflow-hidden rounded-2xl border border-[#30D158]/20 bg-[#30D158]/5 dark:border-[#30D158]/20 dark:bg-[#30D158]/8'
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF453A]/12 dark:bg-[#FF453A]/15">
              <FileWarning className="h-3.5 w-3.5 text-[#FF453A]" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#30D158]/12 dark:bg-[#30D158]/15">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#30D158]" />
            </div>
          )}
          <span className="text-sm font-semibold">
            {hasErrors ? 'Fix errors before submitting' : 'CSV looks good'}
          </span>
          {hasEdits ? (
            <span className="rounded-full bg-[#0A84FF]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#0A84FF]">
              edited
            </span>
          ) : null}
        </div>
        <span className="text-muted-foreground rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium dark:bg-white/8">
          {result.totalRows} row{result.totalRows !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3 px-4 pb-4">
        {result.errors.length > 0 && (
          <div className="space-y-1.5 rounded-xl bg-[#FF453A]/8 p-3 dark:bg-[#FF453A]/10">
            {result.errors.slice(0, 5).map(err => (
              <div
                key={err}
                className="flex items-start gap-2 text-xs text-[#cc2218] dark:text-[#FF453A]"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{err}</span>
              </div>
            ))}
            {result.errors.length > 5 && (
              <p className="text-xs font-semibold text-[#cc2218] dark:text-[#FF453A]">
                ...and {result.errors.length - 5} more errors
              </p>
            )}
          </div>
        )}

        {result.warnings.length > 0 && (
          <div className="space-y-1.5 rounded-xl bg-[#FF9F0A]/8 p-3 dark:bg-[#FF9F0A]/10">
            {result.warnings.map(warn => (
              <div
                key={warn}
                className="flex items-start gap-2 text-xs text-[#b86e00] dark:text-[#FF9F0A]"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {previewRows.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-white/60 bg-white/80 dark:border-white/8 dark:bg-white/3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-black/5 bg-black/2 dark:border-white/8 dark:bg-white/4">
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">
                    #
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">
                    Image URL
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">
                    Caption
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">
                    Source
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">
                    Targets
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => {
                  const targetLangs = row.target_langs
                    .split(/[;|,]/)
                    .map(t => t.trim())
                    .filter(Boolean);

                  return (
                    <tr
                      key={`${row.image_url}-${i}`}
                      className="border-b border-black/4 last:border-0 dark:border-white/5"
                    >
                      <td className="text-muted-foreground px-3 py-2 tabular-nums">
                        {i + 1}
                      </td>
                      <td
                        className="max-w-[10rem] truncate px-3 py-2"
                        title={row.image_url}
                      >
                        {row.image_url}
                      </td>
                      <td
                        className="max-w-[7rem] truncate px-3 py-2"
                        title={row.caption}
                      >
                        {row.caption || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td
                        className="px-3 py-2"
                        title={
                          row.source_lang
                            ? langName(row.source_lang)
                            : 'Auto-detect'
                        }
                      >
                        {row.source_lang ? (
                          langName(row.source_lang)
                        ) : (
                          <span className="rounded bg-black/6 px-1 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-white/8">
                            auto
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap items-center gap-1">
                          {targetLangs.map(lang => (
                            <span
                              key={lang}
                              className={`inline-flex items-center gap-0.5 rounded-full bg-[#0A84FF]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#0060d1] dark:bg-[#0A84FF]/15 dark:text-[#0A84FF] ${isEditable ? 'pr-0.5' : ''}`}
                              title={langName(lang)}
                            >
                              {langName(lang)}
                              {isEditable ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTarget(i, lang, row.target_langs)
                                  }
                                  className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-[#FF453A]/20 hover:text-[#FF453A]"
                                  title={`Remove ${langName(lang)}`}
                                >
                                  <X className="h-2 w-2" />
                                </button>
                              ) : null}
                            </span>
                          ))}
                          {isEditable ? (
                            <LanguageAdder
                              currentLangs={targetLangs}
                              onAdd={code =>
                                addTarget(i, code, row.target_langs)
                              }
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {result.totalRows > 5 && (
              <div className="text-muted-foreground border-t border-black/4 px-3 py-2 text-center text-[10px] dark:border-white/5">
                Showing 5 of {result.totalRows} rows
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Returns true if the CSV text has no validation errors. */
export function validateCsvFile(file: File): Promise<boolean> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const result = validate(e.target?.result as string);
        resolve(result.errors.length === 0);
      } catch {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}
