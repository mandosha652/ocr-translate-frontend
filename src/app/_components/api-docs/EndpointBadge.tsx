export function EndpointBadge({
  method,
}: {
  method: 'GET' | 'POST' | 'DELETE';
}) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-mono text-xs font-bold ${colors[method]}`}
    >
      {method}
    </span>
  );
}
