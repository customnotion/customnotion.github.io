import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Boxes,
  Palette,
  Compass,
  MousePointerClick,
  FileText,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { isPasswordProtectionEnabled, endAdminSession } from '../lib/auth.js';

const NAV_ITEMS = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/modules', label: 'Modules', icon: Boxes },
  { to: '/admin/theme', label: 'Theme', icon: Palette },
  { to: '/admin/navigation', label: 'Navigation', icon: Compass },
  { to: '/admin/buttons', label: 'Buttons', icon: MousePointerClick },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
];

export default function AdminLayout({ onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const protectedMode = isPasswordProtectionEnabled();

  function handleLogout() {
    endAdminSession();
    onLogout();
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'bg-accent text-white' : 'text-ink/70 hover:bg-black/5 hover:text-ink'
    }`;

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-line bg-card px-4 py-6">
        <SidebarContent linkClass={linkClass} protectedMode={protectedMode} onLogout={handleLogout} />
      </aside>

      {/* Sidebar (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card px-4 py-6 animate-slide-up flex flex-col">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="self-end p-2 mb-2 text-muted hover:text-ink"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent
              linkClass={linkClass}
              protectedMode={protectedMode}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-line bg-card">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 text-ink"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">Admin Dashboard</span>
          <span className="w-9" />
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-5xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ linkClass, protectedMode, onLogout, onNavigate }) {
  return (
    <>
      <div className="px-2 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Admin Dashboard</p>
      </div>
      <nav className="flex-1 space-y-1" aria-label="Admin sections">
        {NAV_ITEMS.map(({ to, end, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} onClick={onNavigate}>
            <Icon className="w-4 h-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 pt-4 border-t border-line space-y-1">
        <a
          href="#/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-ink/70 hover:bg-black/5 hover:text-ink"
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          View site
        </a>
        {protectedMode && (
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-ink/70 hover:bg-black/5 hover:text-ink"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            Log out
          </button>
        )}
      </div>
    </>
  );
}
