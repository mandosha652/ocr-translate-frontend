'use client';

import { AlertTriangle, CheckCircle2, FileWarning } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { langName, SUPPORTED_LANGUAGES } from '@/types/language';

interface CsvPreviewProps {
  file: File;
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

const REQUIRED_COLUMNS = [
  'image_url',
  'caption',
  'source_lang',
  'target_langs',
];
const VALID_LANG_CODES = new Set(SUPPORTED_LANGUAGES.map(l => l.code));

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines
    .slice(1)
    .map(line => line.split(',').map(cell => cell.trim()));
  return { headers, rows };
}

function validate(text: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { headers, rows: rawRows } = parseCsv(text);

  if (headers.length === 0) {
    return { errors: ['CSV file is empty'], warnings, rows: [], totalRows: 0 };
  }

  const missing = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  if (missing.length > 0) {
    errors.push(`Missing required columns: ${missing.join(', ')}`);
    return { errors, warnings, rows: [], totalRows: rawRows.length };
  }

  const colIdx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const parsed: ParsedRow[] = [];

  for (let i = 0; i < rawRows.length; i++) {
    const raw = rawRows[i];
    const rowNum = i + 2; // 1-indexed + header

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

    if (row.source_lang && !VALID_LANG_CODES.has(row.source_lang)) {
      errors.push(
        `Row ${rowNum}: unknown source language "${row.source_lang}"`
      );
    }

    const targets = row.target_langs
      .split(/[;|]/)
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

export function CsvPreview({ file }: CsvPreviewProps) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = e => {
      if (!cancelled) setText(e.target?.result as string);
    };
    reader.readAsText(file);
    return () => {
      cancelled = true;
    };
  }, [file]);

  const result = useMemo(() => (text ? validate(text) : null), [text]);

  if (!result) return null;

  const previewRows = result.rows.slice(0, 5);
  const hasErrors = result.errors.length > 0;

  return (
    <Card
      className={hasErrors ? 'border-destructive/40' : 'border-green-500/40'}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <FileWarning className="text-destructive h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          <CardTitle className="text-sm font-semibold">
            CSV Preview — {result.totalRows} row
            {result.totalRows !== 1 ? 's' : ''}
          </CardTitle>
        </div>
        {!hasErrors && (
          <CardDescription className="text-xs">Ready to submit</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {result.errors.length > 0 && (
          <div className="space-y-1.5">
            {result.errors.slice(0, 5).map(err => (
              <div
                key={err}
                className="text-destructive flex items-start gap-1.5 text-xs"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{err}</span>
              </div>
            ))}
            {result.errors.length > 5 && (
              <p className="text-destructive text-xs font-medium">
                ...and {result.errors.length - 5} more errors
              </p>
            )}
          </div>
        )}

        {result.warnings.length > 0 && (
          <div className="space-y-1.5">
            {result.warnings.map(warn => (
              <div
                key={warn}
                className="flex items-start gap-1.5 text-xs text-yellow-600"
              >
                <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {previewRows.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/40 border-b">
                  <th className="px-2.5 py-2 text-left font-medium">#</th>
                  <th className="px-2.5 py-2 text-left font-medium">
                    Image URL
                  </th>
                  <th className="px-2.5 py-2 text-left font-medium">Caption</th>
                  <th className="px-2.5 py-2 text-left font-medium">Source</th>
                  <th className="px-2.5 py-2 text-left font-medium">Targets</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={row.image_url} className="border-b last:border-0">
                    <td className="text-muted-foreground px-2.5 py-2">
                      {i + 1}
                    </td>
                    <td
                      className="max-w-[180px] truncate px-2.5 py-2"
                      title={row.image_url}
                    >
                      {row.image_url}
                    </td>
                    <td
                      className="max-w-[120px] truncate px-2.5 py-2"
                      title={row.caption}
                    >
                      {row.caption || (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td
                      className="px-2.5 py-2"
                      title={
                        row.source_lang
                          ? langName(row.source_lang)
                          : 'Auto-detect'
                      }
                    >
                      {row.source_lang ? (
                        langName(row.source_lang)
                      ) : (
                        <span className="text-muted-foreground">auto</span>
                      )}
                    </td>
                    <td className="px-2.5 py-2">
                      <div className="flex flex-wrap gap-1">
                        {row.target_langs
                          .split(/[;|]/)
                          .filter(Boolean)
                          .map(lang => (
                            <Badge
                              key={lang.trim()}
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                              title={langName(lang.trim())}
                            >
                              {langName(lang.trim())}
                            </Badge>
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.totalRows > 5 && (
              <div className="text-muted-foreground border-t px-2.5 py-2 text-center text-[10px]">
                Showing 5 of {result.totalRows} rows
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Returns true if the CSV text has no validation errors. */
export function validateCsvFile(file: File): Promise<boolean> {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const result = validate(e.target?.result as string);
      resolve(result.errors.length === 0);
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}
