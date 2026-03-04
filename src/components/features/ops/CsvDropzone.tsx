'use client';

import { Upload } from 'lucide-react';
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
          'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors select-none',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/30 hover:border-primary/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
        {filename ? (
          <p className="text-sm font-medium">{filename}</p>
        ) : (
          <>
            <p className="text-sm font-medium">
              {isDragActive
                ? 'Drop CSV here'
                : 'Drop CSV here or click to browse'}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              Required columns: image_url, caption, source_lang, target_langs
            </p>
          </>
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
