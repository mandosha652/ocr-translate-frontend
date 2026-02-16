import Link from 'next/link';
import { Languages } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 max-w-6xl items-center px-4">
        <Link href="/" className="flex items-center gap-2">
          <Languages className="h-6 w-6" />
          <span className="text-xl font-semibold">OCR Translate</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
