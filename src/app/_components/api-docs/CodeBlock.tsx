export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">
      <code>{children}</code>
    </pre>
  );
}
