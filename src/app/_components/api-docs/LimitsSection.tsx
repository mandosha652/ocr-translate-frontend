export function LimitsSection() {
  return (
    <section className="mb-10 space-y-4">
      <h2 className="text-xl font-semibold">Limits</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Max file size', value: '10 MB' },
          { label: 'Max images per batch', value: '20' },
          { label: 'Max languages per batch', value: '3 (free) / 12 (pro)' },
          { label: 'Max concurrent batches', value: '3' },
        ].map(item => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <span className="text-muted-foreground text-sm">{item.label}</span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
