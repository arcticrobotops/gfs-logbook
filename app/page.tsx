import { getProducts, getCollections } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export default async function Home() {
  let products: ShopifyProduct[] = [];
  let collections: ShopifyCollection[] = [];
  let fetchError = false;

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
    if (products.length === 0) {
      console.warn('[GFS Logbook] Shopify returned zero products');
    }
  } catch (error) {
    fetchError = true;
    console.error('[GFS Logbook] Failed to fetch from Shopify:', error);
  }

  // #24: Home page WebSite JSON-LD
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Coast Station Log — Ghost Forest Surf Club',
    url: 'https://ghostforestsurfclub.com',
    description: 'Maritime inventory of coldwater surf goods. Station 45 N. Neskowin, Oregon.',
  };
  const websiteJsonLdString = JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c');

  return (
    <div className="min-h-screen bg-aged-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLdString }}
      />
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      {fetchError ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#7A5A0B', fontSize: '14px', letterSpacing: '0.25em', marginBottom: '16px' }}>&#9670;</div>
          <h2
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.25rem',
              color: '#1A2744',
              marginBottom: '12px',
            }}
          >
            Station log temporarily unavailable
          </h2>
          <p
            style={{
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#666666',
              maxWidth: '20rem',
              lineHeight: '1.6',
            }}
          >
            We&apos;re having trouble loading inventory. Please refresh to try again.
          </p>
        </div>
      ) : (
        <FeedLayout
          initialProducts={products}
          collections={collections}
        />
      )}
      <Footer />
    </div>
  );
}
