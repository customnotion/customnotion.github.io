import { Globe } from 'lucide-react';
import { sanitizeUrl } from '../lib/security.js';

// lucide-react intentionally ships no trademarked brand logos (GitHub,
// LinkedIn, X/Twitter, etc.) -- a generic globe/link glyph is used for every
// social entry instead, with the platform name exposed via aria-label and
// a visible caption. This keeps the icon set to a single open-source,
// dependency-light package with no brand-asset licensing questions.


export default function Footer({ siteConfig }) {
  const social = siteConfig.social || [];

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted text-center sm:text-left">{siteConfig.footerText}</p>

        <div className="flex items-center gap-4">
          {social.map((s) => (
            <a
              key={s.id}
              href={sanitizeUrl(s.url)}
              target="_blank"
              rel="noopener noreferrer"
              title={s.platform}
              aria-label={s.platform}
              className="flex items-center gap-1.5 text-muted hover:text-accent transition-colors"
            >
              <Globe className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline text-xs">{s.platform}</span>
            </a>
          ))}
          <span className="text-xs text-muted border-l border-line pl-4">v{siteConfig.version}</span>
        </div>
      </div>
    </footer>
  );
}
