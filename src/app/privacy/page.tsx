import { PrivacyContent } from './_components/PrivacyContent';
import { PrivacyFooter } from './_components/PrivacyFooter';
import { PrivacyHeader } from './_components/PrivacyHeader';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how ImgText collects, uses, and protects your data — including uploaded images, account info, and cookies.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PrivacyHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-2 text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10 text-sm">
            Last updated: February 22, 2026
          </p>
          <PrivacyContent />
          <section className="space-y-3 pt-8">
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p className="text-muted-foreground">
              Privacy questions or data requests?{' '}
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
      <PrivacyFooter />
    </div>
  );
}
