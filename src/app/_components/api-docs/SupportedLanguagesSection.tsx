export function SupportedLanguagesSection() {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-xl font-semibold">Supported Languages</h2>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
        {[
          { code: 'en', name: 'English' },
          { code: 'de', name: 'German' },
          { code: 'fr', name: 'French' },
          { code: 'es', name: 'Spanish' },
          { code: 'it', name: 'Italian' },
          { code: 'pt', name: 'Portuguese' },
          { code: 'nl', name: 'Dutch' },
          { code: 'sv', name: 'Swedish' },
          { code: 'da', name: 'Danish' },
          { code: 'no', name: 'Norwegian' },
          { code: 'fi', name: 'Finnish' },
        ].map(lang => (
          <div
            key={lang.code}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>{lang.name}</span>
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              {lang.code}
            </code>
          </div>
        ))}
      </div>
    </section>
  );
}
