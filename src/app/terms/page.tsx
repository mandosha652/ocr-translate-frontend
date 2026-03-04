import { TermsContent } from './_components/TermsContent';
import { TermsFooter } from './_components/TermsFooter';
import { TermsHeader } from './_components/TermsHeader';

export const metadata = {
  title: 'Terms of Service',
  description:
    'Read the Terms of Service for ImgText — acceptable use, account responsibilities, uploaded content, and liability.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <TermsHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-2 text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mb-10 text-sm">
            Last updated: February 22, 2026
          </p>
          <TermsContent />
          <section className="space-y-3 pt-8">
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p className="text-muted-foreground">
              Questions about these Terms?{' '}
              <a
                href="/help"
                className="text-primary underline underline-offset-4"
              >
                Contact us
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <TermsFooter />
    </div>
  );
}
