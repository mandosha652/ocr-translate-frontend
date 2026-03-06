'use client';

import { Link as LinkIcon, Loader2, RotateCcw, Upload, X } from 'lucide-react';

import { ImageUploader } from '@/components/features/translate/ImageUploader';
import { LanguageSelect } from '@/components/features/translate/LanguageSelect';
import { VerifyEmailNotice } from '@/components/features/verify-email-notice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isValidHttpUrl } from '@/lib/utils';

type InputMode = 'upload' | 'url';
type PageState = 'idle' | 'submitting' | 'polling' | 'done' | 'error';

interface TranslateFormCardProps {
  inputMode: InputMode;
  onInputModeChange: (mode: InputMode) => void;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  targetLang: string;
  onTargetLangChange: (lang: string) => void;
  sourceLang: string;
  onSourceLangChange: (lang: string) => void;
  pageState: PageState;
  isBusy: boolean;
  hasInput: boolean;
  canSubmit: boolean;
  isVerified: boolean;
  onTranslate: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export function TranslateFormCard({
  inputMode,
  onInputModeChange,
  file,
  onFileSelect,
  imageUrl,
  onImageUrlChange,
  targetLang,
  onTargetLangChange,
  sourceLang,
  onSourceLangChange,
  pageState,
  isBusy,
  hasInput,
  canSubmit,
  isVerified,
  onTranslate,
  onCancel,
  onReset,
}: TranslateFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Image Input</CardTitle>
        <CardDescription>
          Upload a file or provide a public image URL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={inputMode}
          onValueChange={v => {
            onInputModeChange(v as InputMode);
            onFileSelect(null);
            onImageUrlChange('');
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled={isBusy}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" disabled={isBusy}>
              <LinkIcon className="mr-2 h-4 w-4" />
              URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <ImageUploader
              onFileSelect={onFileSelect}
              selectedFile={file}
              disabled={isBusy}
            />
          </TabsContent>

          <TabsContent value="url" className="mt-4 space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={e => onImageUrlChange(e.target.value)}
              disabled={isBusy}
            />
            <p className="text-muted-foreground text-xs">
              Must be a publicly accessible URL to a JPEG, PNG, or WebP image
            </p>
            {imageUrl.trim() && !isValidHttpUrl(imageUrl.trim()) && (
              <p className="text-xs text-amber-600">
                Enter a valid URL starting with http:// or https://
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 sm:grid-cols-2">
          <LanguageSelect
            value={sourceLang}
            onChange={onSourceLangChange}
            label="Source Language"
            placeholder="Auto-detect"
            showAuto
            disabled={isBusy}
          />
          <LanguageSelect
            value={targetLang}
            onChange={onTargetLangChange}
            label="Target Language"
            disabled={isBusy}
          />
        </div>

        {!isVerified && <VerifyEmailNotice />}

        <div className="flex gap-3">
          <Button
            onClick={onTranslate}
            disabled={!canSubmit || !isVerified}
            className="flex-1"
          >
            {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isBusy ? 'Translating…' : 'Translate'}
          </Button>
          {isBusy ? (
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          ) : null}
          {(hasInput || pageState !== 'idle') && !isBusy ? (
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
