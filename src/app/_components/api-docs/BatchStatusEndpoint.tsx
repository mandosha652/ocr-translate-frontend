import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CodeBlock } from './CodeBlock';
import { EndpointBadge } from './EndpointBadge';

export function BatchStatusEndpoint() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <EndpointBadge method="GET" />
          <CardTitle className="font-mono text-sm">
            /api/v1/batch/{'{batch_id}'}
          </CardTitle>
        </div>
        <CardDescription>
          Get the current status and results of a batch job.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Example (curl)</p>
          <CodeBlock>{`curl https://api.imgtext.io/api/v1/batch/batch_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</CodeBlock>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Response (200)</p>
          <CodeBlock>{`{
  "batch_id": "batch_abc123",
  "status": "completed",
  "total_images": 3,
  "completed_count": 3,
  "failed_count": 0,
  "images": [
    {
      "image_id": "img_1",
      "original_filename": "photo.jpg",
      "status": "completed",
      "outputs": {
        "en": {
          "translated_image_url": "https://...",
          "original_image_url": "https://...",
          "clean_image_url": "https://..."
        }
      }
    }
  ]
}`}</CodeBlock>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Batch status values</p>
          <div className="flex flex-wrap gap-2">
            {[
              'pending',
              'processing',
              'completed',
              'partially_completed',
              'failed',
              'cancelled',
            ].map(s => (
              <code key={s} className="bg-muted rounded px-1.5 py-0.5 text-xs">
                {s}
              </code>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
