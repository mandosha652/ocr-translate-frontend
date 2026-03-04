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

export function TranslateImageEndpoint() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <EndpointBadge method="POST" />
          <CardTitle className="font-mono text-sm">
            /api/v1/translate-image
          </CardTitle>
        </div>
        <CardDescription>
          Translate text in a single image. Returns the translated image, a
          text-removed image, and a region-by-region breakdown.
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
                name: 'image',
                type: 'File',
                required: true,
                desc: 'Image file (JPEG, PNG, WebP). Max 10 MB.',
              },
              {
                name: 'target_lang',
                type: 'string',
                required: true,
                desc: 'Target language code (e.g., "en", "de").',
              },
              {
                name: 'source_lang',
                type: 'string',
                required: false,
                desc: 'Source language code. Omit for auto-detect.',
              },
              {
                name: 'exclude_text',
                type: 'string',
                required: false,
                desc: 'Comma-separated patterns to skip (e.g., "BRAND,@handle").',
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
          <p className="mb-2 text-sm font-medium">Example (curl)</p>
          <CodeBlock>{`curl -X POST https://api.imgtext.io/api/v1/translate-image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@photo.jpg" \\
  -F "target_lang=en" \\
  -F "source_lang=de"`}</CodeBlock>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Response (200)</p>
          <CodeBlock>{`{
  "original_image_url": "https://...",
  "translated_image_url": "https://...",
  "clean_image_url": "https://...",
  "regions": [
    {
      "id": "region_1",
      "original_text": "Willkommen",
      "translated_text": "Welcome",
      "confidence": 0.97,
      "bounding_box": { "x": 10, "y": 20, "width": 80, "height": 30 }
    }
  ]
}`}</CodeBlock>
        </div>
      </CardContent>
    </Card>
  );
}
