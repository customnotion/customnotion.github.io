import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { sanitizeUrl } from '../lib/security.js';

export default function Navbar({ siteConfig, navigation }) {
  const [open, setOpen] = useState(false);
  const items = [...navigation].filter((n) => n.visible).sort((a, b) => a.order - b.order);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-surface/85 border-b border-line">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Primary">
        <a href="#/" className="flex items-center gap-2 font-semibold text-ink text-lg">
          {siteConfig.logoUrl ? (
            <img src={sanitizeUrl(siteConfig.logoUrl)} alt="" className="h-7 w-7 rounded-md object-cover" />
          ) : (
            <span className="h-7 w-7 rounded-md bg-accent text-white flex items-center justify-center text-xs font-bold">
              {(siteConfig.logoText || siteConfig.title || 'S').slice(0, 2).toUpperCase()}
            </span>
          )}
          <span>{siteConfig.logoText || siteConfig.title}</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {items.map((item) => (
            <li key={item.id}>
              <a href={sanitizeUrl(item.url)} className="text-sm text-ink/80 hover:text-accent transition-colors">
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 rounded-lg text-ink hover:bg-black/5"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <ul id="mobile-nav" className="md:hidden border-t border-line bg-surface animate-slide-up">
          {items.map((item) => (
            <li key={item.id} className="border-b border-line/60 last:border-0">
              <a
                href={sanitizeUrl(item.url)}
                onClick={() => setOpen(false)}
                className="block px-6 py-3.5 text-sm text-ink hover:bg-black/5"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
