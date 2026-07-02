import { useParams, Link } from 'react-router-dom';
import { useSiteData } from '../lib/useStore.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';

/**
 * Renders any page created in Admin > Page Manager. Content is plain text
 * (split into paragraphs on blank lines) rendered as normal React
 * children -- never through dangerouslySetInnerHTML -- so page content
 * can't be used to inject scripts or markup.
 */
export default function DynamicPage() {
  const { slug } = useParams();
  const data = useSiteData();
  const page = data.pages.find((p) => p.slug === slug);

  return (
    <>
      <Navbar siteConfig={data.siteConfig} navigation={data.navigation} />
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-20 flex-1 w-full">
        {!page ? (
          <EmptyState
            icon="FileQuestion"
            title="Page not found"
            message="This page doesn't exist or may have been removed."
          />
        ) : (
          <article className="animate-fade-in">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6">
              <Icon name={page.icon || 'FileText'} className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4">{page.name}</h1>
            {page.description && <p className="text-lg text-muted mb-8">{page.description}</p>}
            <div className="prose-content space-y-4 text-ink leading-relaxed">
              {(page.content || '')
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
            <Link to="/" className="inline-block mt-10 text-sm text-accent hover:underline">
              ← Back to home
            </Link>
          </article>
        )}
      </main>
      <Footer siteConfig={data.siteConfig} />
    </>
  );
}
