const sections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using ImgText ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.',
  },
  {
    title: '2. Use of the Service',
    content:
      'You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:',
    bullets: [
      'Upload images containing illegal, harmful, or infringing content',
      'Attempt to reverse-engineer, disassemble, or compromise the Service',
      'Use automated tools to exceed reasonable usage limits or degrade service for others',
      'Share API keys with third parties or use them in publicly accessible client-side code',
    ],
  },
  {
    title: '3. Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and API keys. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorised access.',
  },
  {
    title: '4. Uploaded Content',
    content:
      'You retain ownership of all images you upload. By uploading content, you grant us a limited, non-exclusive licence to process and store the content solely to provide the Service. We do not use your images to train machine learning models.',
  },
  {
    title: '5. Service Availability',
    content:
      'We strive for high availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue the Service at any time with reasonable notice where practicable.',
  },
  {
    title: '6. Disclaimer of Warranties',
    content:
      'The Service is provided "as is" without warranties of any kind, whether express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement. Translation accuracy is not guaranteed.',
  },
  {
    title: '7. Limitation of Liability',
    content:
      'To the maximum extent permitted by law, ImgText shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the Service.',
  },
  {
    title: '8. Changes to Terms',
    content:
      'We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms.',
  },
];

export function TermsContent() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed">
      {sections.map(section => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-xl font-semibold">{section.title}</h2>
          <p className="text-muted-foreground">{section.content}</p>
          {'bullets' in section && section.bullets ? (
            <ul className="text-muted-foreground list-disc space-y-1 pl-6">
              {section.bullets.map(bullet => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
