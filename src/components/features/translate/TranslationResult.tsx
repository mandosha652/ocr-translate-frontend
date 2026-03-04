'use client';

import { Info } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CONFIDENCE_THRESHOLD } from '@/lib/constants';
import type { TranslateResponse } from '@/types';

import { ImageTabContent } from './ImageTabContent';
import { TextRegionsPanel } from './TextRegionsPanel';

interface TranslationResultProps {
  result: TranslateResponse;
}

export function TranslationResult({ result }: TranslationResultProps) {
  const lowConfidenceRegions = result.regions.filter(
    r => r.confidence < CONFIDENCE_THRESHOLD
  );

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <CardTitle>Translation Result</CardTitle>
            <div className="flex flex-wrap items-center gap-1.5">
              {lowConfidenceRegions.length > 0 && (
                <Badge variant="outline" className="gap-1 text-amber-600">
                  <Info className="h-3 w-3" />
                  <span className="hidden sm:inline">
                    {lowConfidenceRegions.length} low-confidence region
                    {lowConfidenceRegions.length !== 1 ? 's' : ''}
                  </span>
                  <span className="sm:hidden">
                    {lowConfidenceRegions.length} low-conf.
                  </span>
                </Badge>
              )}
              {result.detected_source_lang && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="uppercase">
                      {result.detected_source_lang}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Auto-detected source language</TooltipContent>
                </Tooltip>
              )}
              <Badge variant="secondary">
                {(result.processing_time_ms / 1000).toFixed(1)}s
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="translated" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="translated">Translated</TabsTrigger>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="clean">
                <span className="sm:hidden">Cleaned</span>
                <span className="hidden sm:inline">Text Removed</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="translated" className="mt-4">
              <ImageTabContent
                imageUrl={result.translated_image_url}
                alt="Translated"
                filename="translated.png"
                showCopyButton
                showExternalLink
                priority
              />
            </TabsContent>

            <TabsContent value="original" className="mt-4">
              <ImageTabContent
                imageUrl={result.original_image_url}
                alt="Original"
                filename="original.png"
              />
            </TabsContent>

            <TabsContent value="clean" className="mt-4">
              {result.clean_image_url ? (
                <ImageTabContent
                  imageUrl={result.clean_image_url}
                  alt="Text removed"
                  filename="text-removed.png"
                  description="Original text has been removed via inpainting — the background is reconstructed where text was. Useful as a clean base for custom overlays."
                />
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  Text-removed image not available
                </p>
              )}
            </TabsContent>
          </Tabs>

          <TextRegionsPanel
            regions={result.regions}
            lowConfidenceRegions={lowConfidenceRegions}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
