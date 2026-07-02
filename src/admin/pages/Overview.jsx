import { useRef, useState } from 'react';
import { Boxes, Compass, MousePointerClick, FileText, ShieldCheck, Download, Upload, RotateCcw } from 'lucide-react';
import Card from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { useToast } from '../../components/Toast.jsx';
import { useSiteData } from '../../lib/useStore.js';
import { store } from '../../lib/storage.js';
import {
  isPasswordProtectionEnabled,
  setAdminPassword,
  disableAdminPassword,
} from '../../lib/auth.js';

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold text-ink leading-none">{value}</p>
        <p className="text-sm text-muted mt-1">{label}</p>
      </div>
    </Card>
  );
}

export default function Overview() {
  const data = useSiteData();
  const { show } = useToast();
  const fileInputRef = useRef(null);
  const [protectedMode, setProtectedMode] = useState(isPasswordProtectionEnabled());
  const [newPassword, setNewPassword] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleSetPassword(e) {
    e.preventDefault();
    if (!newPassword.trim()) return;
    await setAdminPassword(newPassword.trim());
    setProtectedMode(true);
    setNewPassword('');
    show('Admin password updated.', 'success');
  }

  function handleDisablePassword() {
    disableAdminPassword();
    setProtectedMode(false);
    show('Password protection disabled.', 'info');
  }

  function handleExport() {
    const json = store.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitecraft-data.json';
    a.click();
    URL.revokeObjectURL(url);
    show('Data exported.', 'success');
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        store.importJson(String(reader.result));
        show('Data imported successfully.', 'success');
      } catch {
        show('That file could not be read as valid site data.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Overview</h1>
        <p className="text-sm text-muted mt-1">Everything here is stored locally in this browser.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Boxes} label="Modules" value={data.modules.length} />
        <StatCard icon={Compass} label="Nav items" value={data.navigation.length} />
        <StatCard icon={MousePointerClick} label="Buttons" value={data.buttons.length} />
        <StatCard icon={FileText} label="Pages" value={data.pages.length} />
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-5 h-5 text-accent" aria-hidden="true" />
          <h2 className="text-base font-semibold text-ink">Local password protection</h2>
        </div>
        <p className="text-sm text-muted mb-5">
          Optional. Adds a password gate on this device before the Admin Dashboard is shown. The password is
          hashed (SHA-256 + per-install salt) via the browser's built-in Web Crypto API and never leaves this
          machine.
        </p>
        {protectedMode ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
              Enabled
            </span>
            <Button variant="ghost" size="sm" onClick={handleDisablePassword}>
              Disable
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSetPassword} className="flex flex-wrap items-center gap-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Set a password"
              className="px-4 py-2.5 text-sm rounded-xl border border-line bg-card focus:border-accent focus:ring-1 focus:ring-accent outline-none"
            />
            <Button type="submit" variant="primary" size="sm">
              Enable
            </Button>
          </form>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-ink mb-1.5">Backup &amp; restore</h2>
        <p className="text-sm text-muted mb-5">
          Export everything to a JSON file you control, or restore from a previous export. No data ever leaves
          your device unless you choose to export it.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export JSON
          </Button>
          <Button variant="secondary" size="sm" onClick={handleImportClick}>
            <Upload className="w-4 h-4" /> Import JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button variant="ghost" size="sm" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="w-4 h-4" /> Reset to defaults
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmReset}
        title="Reset all site data?"
        message="This replaces modules, pages, navigation, buttons, and theme with the original defaults. Export a backup first if you want to keep your current setup."
        confirmLabel="Reset"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          store.resetAll();
          setConfirmReset(false);
          show('Site data reset to defaults.', 'info');
        }}
      />
    </div>
  );
}
