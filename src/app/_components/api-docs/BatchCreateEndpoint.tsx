import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CodeBlock } from './CodeBlock';
import { EndpointBadge } from './EndpointBadge';

export function BatchCreateEndpoint() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <EndpointBadge method="POST" />
          <CardTitle className="font-mono text-sm">
            /api/v1/batch/translate
          </CardTitle>
        </div>
        <CardDescription>
          Create a batch translation job for up to 20 images and 10 target
          languages. The job runs asynchronously — poll the status endpoint or
          use a webhook.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">
            Request (multipart/form-data)
          </p>
          <div className="space-y-1 text-sm">
            {[
              {
                name: 'images[]',
                type: 'File[]',
                required: true,
                desc: 'Up to 20 image files.',
              },
              {
                name: 'target_languages[]',
                type: 'string[]',
                required: true,
                desc: 'One or more language codes.',
              },
              {
                name: 'source_lang',
                type: 'string',
                required: false,
                desc: 'Source language. Omit for auto-detect.',
              },
              {
                name: 'exclude_text',
                type: 'string',
                required: false,
                desc: 'Comma-separated patterns to skip.',
              },
              {
                name: 'webhook_url',
                type: 'string',
                required: false,
                desc: 'URL to POST when the batch completes.',
              },
            ].map(f => (
              <div key={f.name} className="flex items-start gap-3">
                <code className="bg-muted min-w-[120px] rounded px-1.5 py-0.5 text-xs">
                  {f.name}
                </code>
                <span className="text-muted-foreground text-xs">{f.type}</span>
                {f.required ? (
                  <Badge variant="default" className="text-xs">
                    required
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    optional
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Response (201)</p>
          <CodeBlock>{`{
  "batch_id": "batch_abc123",
  "status": "pending",
  "total_images": 3,
  "target_languages": ["en", "de"],
  "created_at": "2026-02-22T10:00:00Z"
}`}</CodeBlock>
        </div>
      </CardContent>
    </Card>
  );
}
