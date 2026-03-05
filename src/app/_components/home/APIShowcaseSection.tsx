'use client';

import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const CODE_EXAMPLES = {
  curl: `curl -X POST https://imgtext.io/api/v1/translate-image \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "image=@product.jpg" \\
  -F "target_lang=de" \\
  -F "source_lang=auto"`,
  python: `import requests

response = requests.post(
  "https://imgtext.io/api/v1/translate-image",
  headers={"Authorization": "Bearer YOUR_API_KEY"},
  files={"image": open("product.jpg", "rb")},
  data={
    "target_lang": "de",
    "source_lang": "auto"
  }
)

translated_url = response.json()["translated_image_url"]`,
  javascript: `const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('image', fs.createReadStream('product.jpg'));
form.append('target_lang', 'de');
form.append('source_lang', 'auto');

const response = await fetch(
  'https://imgtext.io/api/v1/translate-image',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: form
  }
);

const { translated_image_url } = await response.json();`,
};

type Language = keyof typeof CODE_EXAMPLES;

export function APIShowcaseSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('curl');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLanguage]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="border-t">
      <div className="container mx-auto max-w-6xl px-4 py-24 md:py-32">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-primary mb-3 text-sm font-semibold tracking-widest uppercase">
            For developers
          </p>
          <h2 className="mb-5 text-4xl leading-tight font-bold tracking-tight md:text-5xl">
            Simple, powerful API
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Integrate image translation into your pipeline with just a few lines
            of code
          </p>
        </motion.div>

        {/* Code showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl"
        >
          {/* Language tabs */}
          <div className="border-border/50 mb-0 flex gap-1 border-b">
            {(Object.keys(CODE_EXAMPLES) as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`border-b-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                  selectedLanguage === lang
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground border-transparent'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div className="border-border/50 relative overflow-hidden rounded-2xl border bg-[#0d1117]">
            {/* Header */}
            <div className="border-border/50 flex items-center justify-between border-b bg-[#0d1117] px-6 py-4">
              <p className="font-mono text-xs text-slate-400">
                {selectedLanguage === 'curl' && 'Translate an image to German'}
                {selectedLanguage === 'python' && 'Python example'}
                {selectedLanguage === 'javascript' && 'Node.js example'}
              </p>
              <button
                onClick={handleCopy}
                className="bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Code */}
            <pre className="overflow-x-auto p-6">
              <code className="font-mono text-sm text-slate-200">
                {CODE_EXAMPLES[selectedLanguage]}
              </code>
            </pre>
          </div>

          {/* Features list */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex gap-4"
            >
              <div className="bg-primary/10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground mb-1 font-semibold">Webhooks</p>
                <p className="text-muted-foreground text-sm">
                  Get notified when batch jobs complete with custom webhook URLs
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex gap-4"
            >
              <div className="bg-primary/10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground mb-1 font-semibold">
                  Rate limiting
                </p>
                <p className="text-muted-foreground text-sm">
                  Fair usage limits scale with your plan. Burst up to 100
                  req/min
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-4"
            >
              <div className="bg-primary/10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground mb-1 font-semibold">API keys</p>
                <p className="text-muted-foreground text-sm">
                  Create unlimited API keys with optional expiry and per-key
                  usage stats
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex gap-4"
            >
              <div className="bg-primary/10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground mb-1 font-semibold">
                  Full documentation
                </p>
                <p className="text-muted-foreground text-sm">
                  Complete API reference with examples for every language
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <a
              href="/api-docs"
              className="border-border/60 text-foreground hover:border-border hover:bg-muted/50 inline-flex items-center justify-center rounded-full border px-8 py-3 font-semibold transition-all duration-200"
            >
              Read API docs
            </a>
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.45 0.22 260), oklch(0.55 0.20 300))',
              }}
            >
              Get API key
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
