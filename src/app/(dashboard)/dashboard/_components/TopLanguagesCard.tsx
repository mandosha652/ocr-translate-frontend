'use client';

import { Languages } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SUPPORTED_LANGUAGES } from '@/types';

function getLanguageName(code: string): string {
  return (
    SUPPORTED_LANGUAGES.find(l => l.code === code)?.name ?? code.toUpperCase()
  );
}

interface TopLanguagesCardProps {
  languages: string[];
  isLoading: boolean;
}

export function TopLanguagesCard({
  languages,
  isLoading,
}: TopLanguagesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Languages className="h-4 w-4" />
          Your Top Languages
        </CardTitle>
        <CardDescription>Most frequently translated to</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-muted h-6 w-16 animate-pulse rounded-full"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {languages.map(code => (
              <Badge key={code} variant="secondary">
                {getLanguageName(code)}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
