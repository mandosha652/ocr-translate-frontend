'use client';

import { FileCheck, FileSpreadsheet } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

interface CsvDropzoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function CsvDropzone({ onFile, disabled }: CsvDropzoneProps) {
  const [filename, setFilename] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setFilename(file.name);
        onFile(file);
      }
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { 'text/csv': ['.csv'] },
      multiple: false,
      disabled,
    });

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors select-none',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        {filename ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm font-medium">{filename}</p>
            <p className="text-muted-foreground text-xs">
              Click or drop to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <FileSpreadsheet className="text-muted-foreground h-5 w-5" />
            </div>
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop CSV here'
                : 'Drop CSV here or click to browse'}
            </p>
            <p className="text-muted-foreground text-xs">
              Columns: image_url, caption, source_lang, target_langs
            </p>
          </div>
        )}
      </div>
      {fileRejections.length > 0 && (
        <p className="text-destructive text-sm" role="alert">
          Only .csv files are accepted
        </p>
      )}
    </div>
  );
}
