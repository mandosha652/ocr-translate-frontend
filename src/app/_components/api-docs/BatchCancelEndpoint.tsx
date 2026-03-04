import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { CodeBlock } from './CodeBlock';
import { EndpointBadge } from './EndpointBadge';

export function BatchCancelEndpoint() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <EndpointBadge method="POST" />
          <CardTitle className="font-mono text-sm">
            /api/v1/batch/{'{batch_id}'}/cancel
          </CardTitle>
        </div>
        <CardDescription>Cancel a running batch job.</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeBlock>{`curl -X POST https://api.imgtext.io/api/v1/batch/batch_abc123/cancel \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</CodeBlock>
      </CardContent>
    </Card>
  );
}
