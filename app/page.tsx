import { getProducts, getCollections } from '@/lib/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function Home() {
  let products = [];
  let collections = [];

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

  return (
    <div className="min-h-screen bg-aged-cream">
      <FeedLayout
        initialProducts={products}
        collections={collections}
      />
      <Footer />
    </div>
  );
}
