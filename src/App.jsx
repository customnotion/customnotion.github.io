import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSiteData } from './lib/useStore.js';
import { ToastProvider } from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import DynamicPage from './pages/DynamicPage.jsx';
import AdminApp from './admin/AdminApp.jsx';

/** Applies the Admin > Theme Settings colors to CSS custom properties live. */
function useThemeVars(theme) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme.accent) root.style.setProperty('--accent', theme.accent);
    if (theme.accentDark) root.style.setProperty('--accent-dark', theme.accentDark);
    if (theme.surface) root.style.setProperty('--surface', theme.surface);
    if (theme.card) root.style.setProperty('--card', theme.card);
    if (theme.ink) root.style.setProperty('--ink', theme.ink);
  }, [theme]);
}

function ThemedApp() {
  const data = useSiteData();
  useThemeVars(data.theme);

  useEffect(() => {
    document.title = data.siteConfig.title || 'SiteCraft';
  }, [data.siteConfig.title]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/:slug" element={<DynamicPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ThemedApp />
    </ToastProvider>
  );
}
