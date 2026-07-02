import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import { isValidHexColor } from '../../lib/security.js';

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-ink block mb-1.5">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-11 h-11 rounded-xl border border-line cursor-pointer shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
        />
      </div>
    </div>
  );
}

export default function ThemeSettings() {
  const data = useSiteData();
  const { show } = useToast();
  const [theme, setTheme] = useState(data.theme);
  const [siteConfig, setSiteConfig] = useState(data.siteConfig);

  function handleSave(e) {
    e.preventDefault();
    const invalid = ['accent', 'accentDark', 'surface', 'card', 'ink'].filter(
      (key) => theme[key] && !isValidHexColor(theme[key]),
    );
    if (invalid.length) {
      show('Please use valid hex colors (e.g. #12355B).', 'error');
      return;
    }
    store.updateTheme(theme);
    store.updateSiteConfig(siteConfig);
    show('Theme settings saved.', 'success');
  }

  function handleReset() {
    store.resetTheme();
    setTheme(store.getSnapshot().theme);
    show('Theme reset to defaults.', 'info');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Theme Settings</h1>
          <p className="text-sm text-muted mt-1">Changes apply instantly across the whole site.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" /> Reset
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-5">
          <h2 className="text-sm font-semibold text-ink">Colors</h2>
          <ColorField label="Accent color" value={theme.accent} onChange={(v) => setTheme({ ...theme, accent: v })} />
          <ColorField
            label="Accent hover color"
            value={theme.accentDark}
            onChange={(v) => setTheme({ ...theme, accentDark: v })}
          />
          <ColorField
            label="Background color"
            value={theme.surface}
            onChange={(v) => setTheme({ ...theme, surface: v })}
          />
          <ColorField label="Card color" value={theme.card} onChange={(v) => setTheme({ ...theme, card: v })} />
          <ColorField label="Text color" value={theme.ink} onChange={(v) => setTheme({ ...theme, ink: v })} />
        </Card>

        <Card className="p-6 space-y-5">
          <h2 className="text-sm font-semibold text-ink">Site identity</h2>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Website title</label>
            <input
              value={siteConfig.title}
              onChange={(e) => setSiteConfig({ ...siteConfig, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Logo text</label>
            <input
              value={siteConfig.logoText}
              onChange={(e) => setSiteConfig({ ...siteConfig, logoText: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Logo image URL (optional)</label>
            <input
              value={siteConfig.logoUrl}
              onChange={(e) => setSiteConfig({ ...siteConfig, logoUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Tagline</label>
            <input
              value={siteConfig.tagline}
              onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">Footer text</label>
            <input
              value={siteConfig.footerText}
              onChange={(e) => setSiteConfig({ ...siteConfig, footerText: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-line focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Button type="submit" variant="primary">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
