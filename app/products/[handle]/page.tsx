import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import ProductDetail from '@/components/ProductDetail';
import ProductImageGallery from '@/components/ProductImageGallery';
import PDPSkeleton from '@/components/PDPSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

export const revalidate = 60;

export async function generateStaticParams() {
  const { products } = await getProducts(100);
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: 'Item Not Found | GFS Logbook' };
  }

  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  const image = product.images.edges[0]?.node;

  return {
    title: `${product.title} | GFS Logbook`,
    description: product.description
      ? product.description.slice(0, 160)
      : `${product.title} - Issued at $${formattedPrice}. Ghost Forest Surf Club.`,
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160) || '',
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: product.title }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const images = product.images.edges.map((e) => e.node);
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const collection = product.collections.edges[0]?.node;

  // Related items
  const { products: allRelated } = await getProducts(20, undefined, collection?.handle || undefined);
  const relatedProducts = allRelated
    .filter((p) => p.handle !== handle)
    .slice(0, 4)
    .map((p, i) => ({
      handle: p.handle,
      title: p.title,
      price: parseFloat(p.priceRange.minVariantPrice.amount),
      imageUrl: p.images.edges[0]?.node.url || null,
      imageAlt: p.images.edges[0]?.node.altText || null,
      itemNo: String(i + 1).padStart(3, '0'),
    }));
  const shopifyUrl =
    product.onlineStoreUrl ||
    `https://ghostforestsurfclub.com/products/${product.handle}`;

  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount);
  const currencyCode = product.priceRange.minVariantPrice.currencyCode;
  const hasMultiplePrices = minPrice !== maxPrice;
  const anyAvailable = product.variants.edges.some(({ node }) => node.availableForSale);
  const hasVariants = product.variants.edges.length > 1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || undefined,
    image: images.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'Ghost Forest Surf Club',
    },
    ...(hasMultiplePrices
      ? {
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: minPrice.toFixed(2),
            highPrice: maxPrice.toFixed(2),
            priceCurrency: currencyCode,
            availability: anyAvailable
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            offerCount: product.variants.edges.length,
            url: shopifyUrl,
          },
        }
      : {
          offers: {
            '@type': 'Offer',
            price: minPrice.toFixed(2),
            priceCurrency: currencyCode,
            availability: anyAvailable
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: shopifyUrl,
          },
        }),
  };

  return (
    <Suspense fallback={<PDPSkeleton />}>
      <ErrorBoundary>
        <main className="min-h-screen bg-aged-cream text-navy pb-20 md:pb-0">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          {/* Back navigation */}
          <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-graphite hover:text-signal-red transition-colors"
            >
              <span>&larr;</span>
              <span>RETURN TO STATION LOG</span>
            </Link>
          </div>

          <div className="max-w-5xl mx-auto px-4 pb-16">
            {/* ITEM RECORD header */}
            <div className="double-rule-top pt-4 mb-8">
              <div className="flex items-center justify-between mb-1">
                <h1 className="font-mono text-xs tracking-[0.3em] text-navy font-bold">
                  ITEM RECORD
                </h1>
                <span className="font-mono text-xs tracking-[0.2em] text-brass">
                  GHOST FOREST SURF CLUB
                </span>
              </div>
              <div className="h-px bg-navy/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Image section */}
              <div>
                <ProductImageGallery images={images} title={product.title} />
              </div>

              {/* Item data */}
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-[0.06em] text-navy uppercase leading-tight mb-4">
                  {product.title}
                </h2>

                <div className="h-px bg-navy/10 mb-6" />

                {/* Item data grid */}
                <div className="border-[2px] border-navy mb-6">
                  <div className="px-3 py-2 border-b-[1.5px] border-navy/20">
                    <span className="font-mono text-xs tracking-[0.25em] text-navy font-semibold">
                      ITEM DATA
                    </span>
                  </div>

                  <div className="divide-y divide-navy/10">
                    {collection && (
                      <div className="px-3 py-2.5 flex justify-between items-center">
                        <span className="font-mono text-xs tracking-[0.2em] text-graphite">
                          DEPT:
                        </span>
                        <span className="font-mono text-xs tracking-[0.15em] text-navy font-medium">
                          {collection.title.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="px-3 py-2.5 flex justify-between items-center">
                      <span className="font-mono text-xs tracking-[0.2em] text-graphite">
                        STATION:
                      </span>
                      <span className="font-mono text-xs tracking-[0.15em] text-navy font-medium">
                        OREGON COAST
                      </span>
                    </div>
                    <div className="px-3 py-2.5 flex justify-between items-center">
                      <span className="font-mono text-xs tracking-[0.2em] text-graphite">
                        STATUS:
                      </span>
                      <span className="stamp stamp-brass text-xs">
                        {anyAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                      </span>
                    </div>
                    {product.productType && (
                      <div className="px-3 py-2.5 flex justify-between items-center">
                        <span className="font-mono text-xs tracking-[0.2em] text-graphite">
                          TYPE:
                        </span>
                        <span className="font-mono text-xs tracking-[0.15em] text-navy font-medium">
                          {product.productType.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs tracking-[0.15em] text-graphite border border-navy/20 px-2 py-1"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}

                {/* Station notes (description) */}
                {product.descriptionHtml && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs tracking-[0.25em] text-navy font-semibold">
                        STATION NOTES
                      </span>
                      <div className="flex-1 h-px bg-navy/10" />
                    </div>
                    <div
                      className="font-sans text-sm text-graphite leading-relaxed prose prose-sm max-w-none
                        prose-p:mb-3 prose-p:text-graphite
                        prose-strong:text-navy prose-strong:font-semibold
                        prose-a:text-brass prose-a:underline prose-a:underline-offset-2
                        prose-ul:text-graphite prose-ol:text-graphite"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  </div>
                )}

                {/* Interactive variant selector + CTA + sticky mobile bar */}
                <ErrorBoundary>
                  <ProductDetail
                    variants={product.variants.edges}
                    shopifyUrl={shopifyUrl}
                    initialPrice={price}
                    hasVariants={hasVariants}
                  />
                </ErrorBoundary>
              </div>
            </div>

            {/* Related Items */}
            {relatedProducts.length > 0 && (
              <div className="mt-12 pt-8 border-t-[2px] border-navy/20">
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs tracking-[0.3em] text-navy font-bold">
                    RELATED INVENTORY
                  </span>
                  <div className="flex-1 h-px bg-navy/10" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {relatedProducts.map((rp) => (
                    <Link
                      key={rp.handle}
                      href={`/products/${rp.handle}`}
                      className="group block border-[1.5px] border-navy/20 hover:border-navy transition-colors"
                    >
                      <div className="px-2 py-1 border-b border-navy/10 bg-navy/[0.03]">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-graphite uppercase">
                          ITEM {rp.itemNo}
                        </span>
                      </div>
                      <div className="relative aspect-square overflow-hidden bg-aged-cream/50">
                        {rp.imageUrl ? (
                          <Image
                            src={rp.imageUrl}
                            alt={rp.imageAlt || rp.title}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-mono text-xs text-graphite/40">NO IMG</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h3 className="font-sans text-xs font-semibold tracking-wide text-navy uppercase leading-tight line-clamp-2 group-hover:text-signal-red transition-colors">
                          {rp.title}
                        </h3>
                        <p className="font-mono text-[11px] text-brass mt-1">
                          ${rp.price % 1 === 0 ? rp.price.toFixed(0) : rp.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </ErrorBoundary>
    </Suspense>
  );
}
