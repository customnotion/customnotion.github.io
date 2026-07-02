import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { hasActiveAdminSession } from '../lib/auth.js';
import AdminLogin from './AdminLogin.jsx';
import AdminLayout from './AdminLayout.jsx';
import Overview from './pages/Overview.jsx';
import ModulesManager from './pages/ModulesManager.jsx';
import ThemeSettings from './pages/ThemeSettings.jsx';
import NavigationManager from './pages/NavigationManager.jsx';
import ButtonsManager from './pages/ButtonsManager.jsx';
import PagesManager from './pages/PagesManager.jsx';

/**
 * Entry point for the whole /admin section. Everything here — including
 * the optional password gate — runs client-side against localStorage only;
 * there is no server round-trip, no cookies sent anywhere, and no
 * third-party auth provider involved.
 */
export default function AdminApp() {
  const [unlocked, setUnlocked] = useState(hasActiveAdminSession());

  if (!unlocked) {
    return <AdminLogin onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={() => setUnlocked(false)} />}>
        <Route index element={<Overview />} />
        <Route path="modules" element={<ModulesManager />} />
        <Route path="theme" element={<ThemeSettings />} />
        <Route path="navigation" element={<NavigationManager />} />
        <Route path="buttons" element={<ButtonsManager />} />
        <Route path="pages" element={<PagesManager />} />
      </Route>
    </Routes>
  );
}
