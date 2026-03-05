'use client';

import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Globe,
  Languages,
  UserCircle2,
  Webhook,
} from 'lucide-react';
import Link from 'next/link';

import { InfoRow } from '@/components/admin/InfoRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BatchDetailMetadataProps {
  tenantId: string;
  sourceLanguage: string;
  targetLanguages: string[];
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function BatchDetailMetadata({
  tenantId,
  sourceLanguage,
  targetLanguages,
  webhookUrl,
  createdAt,
  updatedAt,
}: BatchDetailMetadataProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Batch Info</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow
          label="Tenant ID"
          icon={UserCircle2}
          value={
            <Link
              href={`/admin/users/${tenantId}`}
              className="text-muted-foreground hover:text-foreground font-mono text-xs break-all transition-colors"
            >
              {tenantId}
            </Link>
          }
        />
        <InfoRow
          label="Source Language"
          icon={Globe}
          value={<span className="font-medium">{sourceLanguage}</span>}
        />
        <InfoRow
          label="Target Languages"
          icon={Languages}
          value={
            <div className="flex flex-wrap justify-end gap-1">
              {targetLanguages.map(lang => (
                <span
                  key={lang}
                  className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          }
        />
        {webhookUrl ? (
          <InfoRow
            label="Webhook"
            icon={Webhook}
            value={
              <span className="text-muted-foreground max-w-40 min-w-0 truncate font-mono text-xs sm:max-w-60">
                {webhookUrl}
              </span>
            }
          />
        ) : null}
        <InfoRow
          label="Created"
          icon={Calendar}
          value={format(new Date(createdAt), 'MMM d, yyyy HH:mm')}
        />
        <InfoRow
          label="Updated"
          icon={Clock}
          value={format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}
        />
      </CardContent>
    </Card>
  );
}
