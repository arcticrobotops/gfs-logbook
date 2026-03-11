'use client';

import { useState, useCallback } from 'react';
import { ShopifyProduct, ShopifyCollection } from '@/types/shopify';
import Navbar from './Navbar';
import ProductCard from './ProductCard';
import EditorialCard, { getEditorialContent } from './EditorialCard';
import TextMoment, { getTextMoment } from './TextMoment';
import ErrorBoundary from './ErrorBoundary';

interface FeedLayoutProps {
  initialProducts: ShopifyProduct[];
  collections: ShopifyCollection[];
}

export default function FeedLayout({ initialProducts, collections }: FeedLayoutProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [activeCollection, setActiveCollection] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCollectionChange = useCallback(async (handle: string) => {
    setActiveCollection(handle);
    setLoading(true);
    setError(false);

    try {
      const params = handle !== 'all' ? `?collection=${handle}` : '';
      const res = await fetch(`/api/products${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Build feed items: interleave products with editorials, text moments, and dividers
  const feedItems: Array<{ type: 'product' | 'editorial' | 'text' | 'divider'; index: number; productIndex?: number }> = [];
  let editorialCount = 0;
  let textCount = 0;
  let dividerCount = 0;

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

    // Insert brass divider every 6 products
    if ((i + 1) % 6 === 0 && (i + 1) % 4 !== 0) {
      feedItems.push({ type: 'divider', index: dividerCount });
      dividerCount++;
    }
  });

  return (
    <>
      <ErrorBoundary>
        <Navbar
          collections={collections}
          activeCollection={activeCollection}
          onCollectionChange={handleCollectionChange}
        />
      </ErrorBoundary>

      <main id="manifest" className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Editorial intro — warmth before the ledger */}
        <div className="mb-8 sm:mb-12 px-1 sm:px-0">
          <div className="max-w-xl">
            <p className="font-mono text-xs sm:text-xs tracking-[0.3em] text-brass mb-4 sm:mb-5">
              STATION 45&deg;06&prime;N &mdash; NESKOWIN, OREGON
            </p>
            <div className="w-8 h-px bg-brass/40 mb-5 sm:mb-6" />
            <h2 className="font-playfair text-xl sm:text-2xl lg:text-[28px] text-navy font-bold leading-[1.3] tracking-wide mb-4 sm:mb-5">
              Coldwater goods logged and issued from the edge of the ghost forest.
            </h2>
            <p className="font-sans text-[13px] sm:text-sm text-graphite/70 leading-relaxed max-w-md">
              Every piece in this manifest was tested in 48-degree water off Proposal Rock before it earned a place in the lineup. Built for fog, salt, and the long paddle north.
            </p>
            <p className="font-mono text-xs tracking-[0.25em] text-graphite/35 mt-5 sm:mt-6 uppercase">
              Current inventory &middot; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Inventory manifest header */}
        <div className="mb-6 sm:mb-8 border-2 border-navy p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
            <div>
              <p className="font-mono text-xs sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-navy font-semibold">
                INVENTORY MANIFEST
              </p>
              <p className="font-mono text-xs sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] text-graphite mt-0.5 sm:mt-1">
                STATION 45&deg;N <span className="text-brass">&#9670;</span> GHOST FOREST SURF CLUB
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="font-mono text-xs sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-brass font-semibold">
                {products.length} ITEMS
              </span>
              {activeCollection !== 'all' && (
                <>
                  <span className="text-brass/40 font-mono text-xs">&#9670;</span>
                  <span className="font-mono text-xs sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] text-signal-red font-semibold">
                    DEPT: {activeCollection.toUpperCase()}
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Brass rule inside header */}
          <div className="flex items-center gap-2 mt-2.5 sm:mt-3">
            <div className="flex-1 h-px bg-brass/20" />
            <span className="font-mono text-xs text-brass/40">&#9632;</span>
            <div className="flex-1 h-px bg-brass/20" />
          </div>
          <p className="font-mono text-xs sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-graphite/50 mt-1.5 sm:mt-2">
            DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()} / GENERAL
          </p>
        </div>

        {error ? (
          <div className="border-2 border-signal-red/30 p-8 text-center">
            <p className="font-mono text-xs tracking-[0.25em] text-signal-red mb-2">&#9670;</p>
            <p className="font-mono text-xs tracking-[0.2em] text-signal-red font-semibold">
              TRANSMISSION ERROR
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-graphite/60 mt-1 mb-4">
              FAILED TO RETRIEVE MANIFEST DATA
            </p>
            <button
              onClick={() => handleCollectionChange(activeCollection)}
              className="font-mono text-xs tracking-[0.2em] text-aged-cream bg-navy border-2 border-navy px-6 py-2.5 hover:bg-signal-red hover:border-signal-red transition-colors"
            >
              RETRY TRANSMISSION
            </button>
          </div>
        ) : loading ? (
          <div className="py-12">
            {/* Station-style loading skeleton */}
            <div className="border-2 border-navy/20 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-navy/10" />
                <p className="font-mono text-xs tracking-[0.3em] text-brass animate-pulse">
                  RETRIEVING MANIFEST...
                </p>
                <div className="h-px flex-1 bg-navy/10" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-navy/30">001</span>
                  <div className="h-2 bg-navy/8 flex-1" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-navy/30">002</span>
                  <div className="h-2 bg-navy/6 w-3/4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-navy/30">003</span>
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
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-2">&#9670;</p>
            <p className="font-mono text-xs tracking-[0.2em] text-graphite">
              NO ITEMS IN THIS DEPARTMENT
            </p>
            <p className="font-mono text-xs tracking-[0.15em] text-graphite/50 mt-1">
              INVENTORY RECORDS EMPTY
            </p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {feedItems.map((item, feedIndex) => {
              if (item.type === 'product') {
                return (
                  <ErrorBoundary key={`product-${item.index}`}>
                    <ProductCard
                      product={products[item.index]}
                      index={item.index}
                    />
                  </ErrorBoundary>
                );
              }

              if (item.type === 'editorial') {
                const editorial = getEditorialContent(item.index);
                return (
                  <ErrorBoundary key={`editorial-${feedIndex}`}>
                    <div className="sm:col-span-2">
                      <EditorialCard {...editorial} />
                    </div>
                  </ErrorBoundary>
                );
              }

              if (item.type === 'text') {
                const moment = getTextMoment(item.index);
                return (
                  <ErrorBoundary key={`text-${feedIndex}`}>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <TextMoment {...moment} />
                    </div>
                  </ErrorBoundary>
                );
              }

              if (item.type === 'divider') {
                return (
                  <div key={`divider-${feedIndex}`} className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-brass/25" />
                      <span className="font-mono text-xs text-brass/50">&#9670;</span>
                      <span className="font-mono text-xs tracking-[0.3em] text-brass/40">
                        CONTINUED
                      </span>
                      <span className="font-mono text-xs text-brass/50">&#9670;</span>
                      <div className="flex-1 h-px bg-brass/25" />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* END OF MANIFEST marker */}
          <div className="mt-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-navy/20" />
              <span className="font-mono text-xs text-navy/30">&#9632;</span>
              <div className="flex-1 h-px bg-navy/20" />
            </div>
            <div className="text-center mt-4">
              <p className="font-mono text-xs tracking-[0.35em] text-graphite/50">
                &#9670; END OF MANIFEST &#9670;
              </p>
              <p className="font-mono text-xs tracking-[0.2em] text-graphite/30 mt-1">
                {products.length} ITEMS TOTAL / STATION 45&deg;N
              </p>
            </div>
          </div>
          </>
        )}
      </main>
    </>
  );
}
