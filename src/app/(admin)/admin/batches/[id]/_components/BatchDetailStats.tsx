'use client';

import { AlertTriangle, ImageIcon, Languages, Layers } from 'lucide-react';

interface BatchDetailStatsProps {
  totalImages: number;
  completedCount: number;
  failedCount: number;
  targetLanguagesCount: number;
}

export function BatchDetailStats({
  totalImages,
  completedCount,
  failedCount,
  targetLanguagesCount,
}: BatchDetailStatsProps) {
  const stats = [
    {
      label: 'Total Images',
      value: totalImages,
      icon: ImageIcon,
      highlight: false,
    },
    {
      label: 'Completed',
      value: completedCount,
      icon: Layers,
      highlight: false,
    },
    {
      label: 'Failed',
      value: failedCount,
      icon: AlertTriangle,
      highlight: failedCount > 0,
    },
    {
      label: 'Languages',
      value: targetLanguagesCount,
      icon: Languages,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, highlight }) => (
        <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
          <Icon
            className={`mx-auto mb-1 h-4 w-4 ${highlight ? 'text-red-500' : 'text-muted-foreground'}`}
          />
          <p
            className={`text-xl font-bold tabular-nums ${highlight ? 'text-red-500' : ''}`}
          >
            {value}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
        </div>
      ))}
    </div>
  );
}
