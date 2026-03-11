'use client';

import { useState, useCallback } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorialContent } from './EditorialCard';
import TextMoment, { getTextMoment } from './TextMoment';

interface FeedLayoutProps {
  initialProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function FeedLayout({ initialProducts, collections }: FeedLayoutProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [activeCollection, setActiveCollection] = useState('all');
  const [loading, setLoading] = useState(false);

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);

    try {
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build feed items: interleave products with editorials and text moments
  const feedItems: Array<{ type: 'product' | 'editorial' | 'text'; index: number; productIndex?: number }> = [];
  let editorialCount = 0;
  let textCount = 0;

  products.forEach((_, i) => {
    feedItems.push({ type: 'product', index: i, productIndex: i });

    // Insert editorial every 4 products (after 4th, 8th, etc.)
    if ((i + 1) % 4 === 0) {
      feedItems.push({ type: 'editorial', index: editorialCount });
      editorialCount++;
    }

    // Insert text moment every 7 products (after 7th, 14th, etc.)
    if ((i + 1) % 7 === 0) {
      feedItems.push({ type: 'text', index: textCount });
      textCount++;
    }
  });

  return (
    <>
      <Navbar
        collections={collections}
        activeCollection={activeCollection}
        onCollectionChange={handleCollectionChange}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Inventory header */}
        <div className="mb-6 border-b border-navy/20 pb-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-graphite">
            INVENTORY MANIFEST — {products.length} ITEMS CATALOGED
            {activeCollection !== 'all' && ` — DEPT: ${activeCollection.toUpperCase()}`}
          </p>
        </div>

        {loading ? (
          <div className="py-12">
            {/* Station-style loading skeleton */}
            <div className="border-2 border-navy/20 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-navy/10" />
                <p className="font-mono text-[10px] tracking-[0.3em] text-brass animate-pulse">
                  RETRIEVING MANIFEST...
                </p>
                <div className="h-px flex-1 bg-navy/10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-navy/30">001</span>
                  <div className="h-2 bg-navy/8 flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-navy/30">002</span>
                  <div className="h-2 bg-navy/6 w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-navy/30">003</span>
                  <div className="h-2 bg-navy/4 w-1/2" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border border-navy/10">
                  <div className="px-2 py-2">
                    <div className="h-1.5 bg-navy/8 w-12" />
                  </div>
                  <div className="h-px bg-navy/5" />
                  <div className="h-40 bg-navy/3" />
                  <div className="h-px bg-navy/5" />
                  <div className="px-2 py-3 space-y-1.5">
                    <div className="h-1.5 bg-navy/6 w-full" />
                    <div className="h-1.5 bg-navy/4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="border-2 border-navy/20 p-8 text-center">
            <p className="font-mono text-[10px] tracking-[0.25em] text-brass mb-2">&#9670;</p>
            <p className="font-mono text-xs tracking-[0.2em] text-graphite">
              NO ITEMS IN THIS DEPARTMENT
            </p>
            <p className="font-mono text-[9px] tracking-[0.15em] text-graphite/50 mt-1">
              INVENTORY RECORDS EMPTY
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {feedItems.map((item, feedIndex) => {
              if (item.type === 'product') {
                return (
                  <ProductCard
                    key={`product-${item.index}`}
                    product={products[item.index]}
                    index={item.index}
                  />
                );
              }

              if (item.type === 'editorial') {
                const editorial = getEditorialContent(item.index);
                return (
                  <div key={`editorial-${feedIndex}`} className="sm:col-span-2">
                    <EditorialCard {...editorial} />
                  </div>
                );
              }

              if (item.type === 'text') {
                const moment = getTextMoment(item.index);
                return (
                  <div key={`text-${feedIndex}`} className="sm:col-span-2 lg:col-span-1">
                    <TextMoment {...moment} />
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </main>
    </>
  );
}
