'use client';

import { FileCheck, FileSpreadsheet } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

interface CsvDropzoneProps {
  file: File | null;
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function CsvDropzone({ file, onFile, disabled }: CsvDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      if (f) {
        onFile(f);
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
          'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 select-none',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/20',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <FileCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Click or drop to replace
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <FileSpreadsheet className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isDragActive
                  ? 'Drop CSV here'
                  : 'Drop CSV here or click to browse'}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Columns: image_url, caption, source_lang, target_langs
              </p>
            </div>
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
