import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { EndpointBadge } from './EndpointBadge';

export function ListBatchesEndpoint() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <EndpointBadge method="GET" />
          <CardTitle className="font-mono text-sm">/api/v1/batch</CardTitle>
        </div>
        <CardDescription>List all batch jobs for your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Query parameters</p>
          <div className="space-y-1 text-sm">
            {[
              {
                name: 'page',
                type: 'int',
                desc: 'Page number (default: 1).',
              },
              {
                name: 'limit',
                type: 'int',
                desc: 'Results per page (default: 20, max: 100).',
              },
            ].map(f => (
              <div key={f.name} className="flex items-center gap-3">
                <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
                  {f.name}
                </code>
                <span className="text-muted-foreground text-xs">{f.type}</span>
                <Badge variant="outline" className="text-xs">
                  optional
                </Badge>
                <span className="text-muted-foreground text-xs">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
