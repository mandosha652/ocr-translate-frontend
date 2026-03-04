import { Languages } from 'lucide-react';
import Link from 'next/link';

export function ApiDocsFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            <span className="font-semibold">ImgText</span>
          </div>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/help" className="hover:underline">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
