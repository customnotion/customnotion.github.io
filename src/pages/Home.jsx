import { Link } from 'react-router-dom';
import { useSiteData } from '../lib/useStore.js';
import { sanitizeUrl } from '../lib/security.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Home() {
  const data = useSiteData();
  const { siteConfig, buttons, modules, features, pages } = data;
  const homePages = [...(pages || [])].filter((p) => p.showOnHome).sort((a, b) => a.order - b.order);

  const primaryButton = buttons.find((b) => b.id === 'button-1' && b.enabled) || buttons.find((b) => b.enabled);
  const secondaryButton = buttons.filter((b) => b.enabled && b.id !== primaryButton?.id)[0];

  const visibleModules = [...modules].filter((m) => m.visible).sort((a, b) => a.order - b.order);

  return (
    <>
      <Navbar siteConfig={siteConfig} navigation={data.navigation} />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 pt-24 pb-20 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink leading-[1.1]">
          {siteConfig.title}
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted max-w-2xl mx-auto">{siteConfig.tagline}</p>

        {(primaryButton || secondaryButton) && (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {primaryButton && (
              <Button
                href={sanitizeUrl(primaryButton.destination)}
                newTab={primaryButton.newTab}
                variant="primary"
                size="lg"
                style={primaryButton.color ? { backgroundColor: primaryButton.color } : undefined}
              >
                {primaryButton.text}
              </Button>
            )}
            {secondaryButton && (
              <Button
                href={sanitizeUrl(secondaryButton.destination)}
                newTab={secondaryButton.newTab}
                variant="secondary"
                size="lg"
              >
                {secondaryButton.text}
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Dynamic modules (managed entirely from the Admin Dashboard) */}
      <section id="modules" className="max-w-6xl mx-auto px-5 sm:px-8 pb-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-ink text-center mb-3">Modules</h2>
        <p className="text-muted text-center mb-12 max-w-xl mx-auto">
          Add, edit, or reorder these from the Admin Dashboard — no code required.
        </p>

        {visibleModules.length === 0 ? (
          <EmptyState
            icon="LayoutGrid"
            title="No modules yet"
            message="Open the Admin Dashboard to add your first module."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleModules.map((mod, i) => (
              <Card
                key={mod.id}
                hoverLift
                className="p-7 flex flex-col animate-slide-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {mod.imageUrl ? (
                  <img
                    src={sanitizeUrl(mod.imageUrl)}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl mb-5"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white"
                    style={{ backgroundColor: mod.bgColor || 'var(--accent)' }}
                  >
                    <Icon name={mod.icon} className="w-6 h-6" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-ink mb-2">{mod.title}</h3>
                <p className="text-sm text-muted leading-relaxed flex-1">{mod.description}</p>
                {mod.buttonText && (
                  <Button href={sanitizeUrl(mod.url)} variant="secondary" size="sm" className="mt-6 self-start">
                    {mod.buttonText}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      {features?.length > 0 && (
        <section id="features" className="bg-card border-y border-line">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
            <h2 className="text-2xl sm:text-3xl font-semibold text-ink text-center mb-12">Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.id} className="text-center sm:text-left">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 mx-auto sm:mx-0">
                    <Icon name={f.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-ink mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {homePages.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 w-full">
          <h2 className="text-2xl sm:text-3xl font-semibold text-ink text-center mb-12">More pages</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homePages.map((page) => (
              <Link key={page.id} to={`/${page.slug}`}>
                <Card hoverLift className="p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                    <Icon name={page.icon} className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-ink mb-1.5">{page.name}</h3>
                  <p className="text-sm text-muted">{page.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer siteConfig={siteConfig} />
    </>
  );
}
