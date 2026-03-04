'use client';

import { ArrowRight, Image as ImageIcon, Layers } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function QuickActionCards() {
  return (
    <>
      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Quick Translate
          </CardTitle>
          <CardDescription>
            Upload an image and get instant translation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/translate">
            <Button className="w-full gap-2">
              Start Translating <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Batch Translate
          </CardTitle>
          <CardDescription>
            Translate multiple images across languages at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/batch">
            <Button variant="outline" className="w-full gap-2">
              Open Batch <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
