// Default, seed content for a brand-new install. This is only ever used the
// first time the app runs on a machine (when nothing exists in
// localStorage yet); after that, everything is fully editable from the
// Admin Dashboard and persisted locally. Nothing here is fetched remotely.

export const DEFAULT_DATA = {
  siteConfig: {
    title: 'SiteCraft',
    logoText: 'SiteCraft',
    logoUrl: '',
    tagline: 'A calmer way to manage your site.',
    footerText: `© ${new Date().getFullYear()} SiteCraft. All rights reserved.`,
    version: '1.0.0',
    social: [
      { id: 'social-1', platform: 'GitHub', url: 'https://github.com' },
      { id: 'social-2', platform: 'LinkedIn', url: 'https://linkedin.com' },
      { id: 'social-3', platform: 'Twitter', url: 'https://twitter.com' },
    ],
  },

  theme: {
    accent: '#12355B',
    accentDark: '#0C2740',
    surface: '#FAF9F6',
    card: '#FFFFFF',
    ink: '#222222',
  },

  navigation: [
    { id: 'nav-1', title: 'Home', url: '/', order: 1, visible: true },
    { id: 'nav-2', title: 'Modules', url: '#modules', order: 2, visible: true },
    { id: 'nav-3', title: 'Features', url: '#features', order: 3, visible: true },
  ],

  modules: [
    {
      id: 'module-1',
      title: 'Content Manager',
      description: 'Add, edit, and reorder homepage content without touching a line of code.',
      buttonText: 'Learn more',
      url: '#',
      icon: 'LayoutGrid',
      bgColor: '#12355B',
      order: 1,
      visible: true,
      imageUrl: '',
    },
    {
      id: 'module-2',
      title: 'Theme Control',
      description: 'Adjust colors, logo, and site title live from the Admin Dashboard.',
      buttonText: 'Customize',
      url: '#',
      icon: 'Palette',
      bgColor: '#12355B',
      order: 2,
      visible: true,
      imageUrl: '',
    },
    {
      id: 'module-3',
      title: 'Local & Private',
      description: 'Everything is stored on this device. No accounts, no cloud, no tracking.',
      buttonText: 'Read more',
      url: '#',
      icon: 'ShieldCheck',
      bgColor: '#12355B',
      order: 3,
      visible: true,
      imageUrl: '',
    },
  ],

  features: [
    {
      id: 'feature-1',
      title: 'Fully Offline',
      description: 'Runs entirely in your browser after the first load. No server required.',
      icon: 'WifiOff',
    },
    {
      id: 'feature-2',
      title: 'Zero Tracking',
      description: 'No analytics, no telemetry, no third-party scripts of any kind.',
      icon: 'EyeOff',
    },
    {
      id: 'feature-3',
      title: 'Drag & Drop',
      description: 'Reorder modules and navigation items with simple, direct controls.',
      icon: 'Move',
    },
    {
      id: 'feature-4',
      title: 'Open Source Stack',
      description: 'Built entirely on permissively licensed, actively maintained libraries.',
      icon: 'Code2',
    },
  ],

  buttons: [
    {
      id: 'button-1',
      text: 'Get Started',
      destination: '#modules',
      style: 'primary',
      color: '#12355B',
      newTab: false,
      enabled: true,
    },
    {
      id: 'button-2',
      text: 'View on GitHub',
      destination: 'https://github.com',
      style: 'secondary',
      color: '#12355B',
      newTab: true,
      enabled: true,
    },
  ],

  pages: [],
};

export const STORAGE_VERSION = 1;
