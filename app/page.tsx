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

  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts(50),
      getCollections(),
    ]);
    products = productsData.products;
    collections = collectionsData;
  } catch (error) {
    console.error('Failed to fetch from Shopify:', error);
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
      <FeedLayout
        initialProducts={products}
        collections={collections}
      />
      <Footer />
    </div>
  );
}
