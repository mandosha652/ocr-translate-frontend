import {
  ApiDocsFooter,
  ApiDocsHeader,
  ApiDocsIntro,
  AuthenticationSection,
  BaseUrlSection,
  BatchCancelEndpoint,
  BatchCreateEndpoint,
  BatchStatusEndpoint,
  GetStartedSection,
  LimitsSection,
  ListBatchesEndpoint,
  SupportedLanguagesSection,
  TranslateImageEndpoint,
} from '@/app/_components/api-docs';

export const metadata = {
  title: 'API Reference',
  description:
    'REST API documentation for ImgText. Translate images programmatically, manage batch jobs, and integrate webhooks.',
  openGraph: {
    title: 'API Reference | ImgText',
    description:
      'REST API documentation for ImgText. Translate images programmatically, manage batch jobs, and integrate webhooks.',
    url: '/api-docs',
  },
  alternates: {
    canonical: '/api-docs',
  },
};

export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <ApiDocsHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-12">
          <ApiDocsIntro />

          <AuthenticationSection />
          <BaseUrlSection />

          <section className="mb-10 space-y-6">
            <h2 className="text-xl font-semibold">Endpoints</h2>
            <TranslateImageEndpoint />
            <BatchCreateEndpoint />
            <BatchStatusEndpoint />
            <BatchCancelEndpoint />
            <ListBatchesEndpoint />
          </section>

          <SupportedLanguagesSection />
          <LimitsSection />
          <GetStartedSection />
        </div>
      </main>
      <ApiDocsFooter />
    </div>
  );
}
