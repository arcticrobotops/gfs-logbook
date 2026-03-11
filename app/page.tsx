import { getProducts, getCollections } from '@/lib/shopify';
import FeedLayout from '@/components/FeedLayout';
import Footer from '@/components/Footer';

export const revalidate = 60;

export default async function Home() {
  const [{ products }, collections] = await Promise.all([
    getProducts(50),
    getCollections(),
  ]);

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
