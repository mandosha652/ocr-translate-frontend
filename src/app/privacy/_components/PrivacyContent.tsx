import Link from 'next/link';

const sections = [
  {
    title: '1. Information We Collect',
    intro: 'We collect the following information when you use ImgText:',
    bullets: [
      {
        bold: 'Account data:',
        text: 'Email address and name provided at registration.',
      },
      {
        bold: 'Usage data:',
        text: 'Number of translations, batch jobs run, and languages used — used to power your dashboard stats.',
      },
      {
        bold: 'Uploaded images:',
        text: 'Images you submit for translation. These are processed and stored temporarily to deliver results.',
      },
      {
        bold: 'API key metadata:',
        text: 'Key names, creation dates, and last-used timestamps.',
      },
      {
        bold: 'Log data:',
        text: 'Standard server logs including IP addresses, request timestamps, and error information.',
      },
    ],
  },
  {
    title: '2. How We Use Your Data',
    intro: 'We use the information we collect to:',
    bullets: [
      { text: 'Provide, operate, and improve the Service' },
      { text: 'Process translations and return results to you' },
      { text: 'Send account-related emails (verification, password reset)' },
      { text: 'Detect and prevent abuse or misuse' },
      { text: 'Aggregate anonymised analytics to understand usage patterns' },
    ],
    footer:
      'We do not use your uploaded images to train machine learning models, and we do not sell your data to third parties.',
  },
  {
    title: '3. Data Retention',
    content:
      'Uploaded images and translated output files are retained for as long as your account is active, or until you delete them. Account data is retained until you delete your account. Log data is retained for up to 90 days.',
  },
  {
    title: '4. Data Sharing',
    content:
      'We share data only with service providers necessary to operate the Service (cloud infrastructure, OCR, and translation APIs). These providers are contractually bound to process data only as instructed. We do not share data with advertisers or data brokers.',
  },
  {
    title: '5. Cookies and Storage',
    content:
      "We use cookies to store authentication tokens. Single translation history is stored in your browser's localStorage — this data never leaves your device. You can clear it at any time from the History page.",
  },
  {
    title: '6. Your Rights',
    content: (
      <>
        You have the right to access, correct, and delete your personal data.
        You can delete your account and all associated data at any time from{' '}
        <Link
          href="/settings"
          className="text-primary underline underline-offset-4"
        >
          Settings → Danger Zone
        </Link>
        . For other data requests, contact us at the address below.
      </>
    ),
  },
  {
    title: '7. Security',
    content:
      'We use industry-standard security measures including HTTPS for all data in transit and access controls for data at rest. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: '8. Changes to This Policy',
    content:
      'We may update this Privacy Policy. We will notify you of significant changes by email or via a notice in the app. Continued use after changes constitutes acceptance.',
  },
];

export function PrivacyContent() {
  return (
    <div className="max-w-none space-y-8 text-sm leading-relaxed">
      {sections.map(section => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          {'intro' in section && (
            <p className="text-muted-foreground">{section.intro}</p>
          )}
          {'content' in section && (
            <p className="text-muted-foreground">{section.content}</p>
          )}
          {'bullets' in section && section.bullets && (
            <ul className="text-muted-foreground list-disc space-y-1 pl-6">
              {section.bullets.map((bullet, i) => (
                <li key={i}>
                  {'bold' in bullet && <strong>{bullet.bold}</strong>}{' '}
                  {bullet.text}
                </li>
              ))}
            </ul>
          )}
          {'footer' in section && (
            <p className="text-muted-foreground">{section.footer}</p>
          )}
        </section>
      ))}
    </div>
  );
}
