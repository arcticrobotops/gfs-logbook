import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts } from '@/lib/shopify';

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
      images: image ? [{ url: image.url, width: image.width, height: image.height }] : [],
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
  const primaryImage = images[0];
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  const collection = product.collections.edges[0]?.node;
  const shopifyUrl =
    product.onlineStoreUrl ||
    `https://ghostforestsurfclub.com/products/${product.handle}`;

  return (
    <main className="min-h-screen bg-aged-cream text-navy">
      {/* Back navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-graphite hover:text-signal-red transition-colors"
        >
          <span>&larr;</span>
          <span>RETURN TO STATION LOG</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* ITEM RECORD header */}
        <div className="double-rule-top pt-4 mb-8">
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-mono text-[11px] tracking-[0.3em] text-navy font-bold">
              ITEM RECORD
            </h1>
            <span className="font-mono text-[11px] tracking-[0.2em] text-brass">
              GHOST FOREST SURF CLUB
            </span>
          </div>
          <div className="h-px bg-navy/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section */}
          <div>
            {primaryImage && (
              <div className="border-[2.5px] border-navy">
                <div className="px-3 py-2 flex items-center justify-between border-b-[1.5px] border-navy/20">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                    PHOTOGRAPH &mdash; ITEM 001
                  </span>
                  <span className="diamond-sep" />
                </div>
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Secondary images */}
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.slice(1, 4).map((img, i) => (
                  <div
                    key={i}
                    className="border-[1.5px] border-navy/30"
                  >
                    <div className="px-2 py-1 border-b border-navy/10">
                      <span className="font-mono text-[11px] tracking-[0.15em] text-graphite">
                        PHOTO {String(i + 2).padStart(3, '0')}
                      </span>
                    </div>
                    <div className="relative aspect-square w-full">
                      <Image
                        src={img.url}
                        alt={img.altText || `${product.title} photo ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 33vw, 16vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Item data */}
          <div>
            {/* Title */}
            <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-[0.06em] text-navy uppercase leading-tight mb-4">
              {product.title}
            </h2>

            {/* Issue price */}
            <div className="mb-6">
              <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                ISSUED AT:{' '}
              </span>
              <span className="font-mono text-lg tracking-[0.1em] text-signal-red font-bold">
                ${formattedPrice}
              </span>
            </div>

            <div className="h-px bg-navy/10 mb-6" />

            {/* Item data grid */}
            <div className="border-[2px] border-navy mb-6">
              <div className="px-3 py-2 border-b-[1.5px] border-navy/20">
                <span className="font-mono text-[11px] tracking-[0.25em] text-navy font-semibold">
                  ITEM DATA
                </span>
              </div>

              <div className="divide-y divide-navy/10">
                {collection && (
                  <div className="px-3 py-2.5 flex justify-between items-center">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                      DEPT:
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-navy font-medium">
                      {collection.title.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="px-3 py-2.5 flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                    ISSUE PRICE:
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.15em] text-signal-red font-medium">
                    ${formattedPrice}
                  </span>
                </div>
                <div className="px-3 py-2.5 flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                    STATION:
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.15em] text-navy font-medium">
                    OREGON COAST
                  </span>
                </div>
                <div className="px-3 py-2.5 flex justify-between items-center">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                    STATUS:
                  </span>
                  <span className="stamp stamp-brass text-[11px]">AVAILABLE</span>
                </div>
                {product.productType && (
                  <div className="px-3 py-2.5 flex justify-between items-center">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-graphite">
                      TYPE:
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.15em] text-navy font-medium">
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
                    className="font-mono text-[11px] tracking-[0.15em] text-graphite border border-navy/20 px-2 py-1"
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
                  <span className="font-mono text-[11px] tracking-[0.25em] text-navy font-semibold">
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

            {/* Variants */}
            {product.variants.edges.length > 1 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] tracking-[0.25em] text-navy font-semibold">
                    AVAILABLE OPTIONS
                  </span>
                  <div className="flex-1 h-px bg-navy/10" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: variant }) => (
                    <span
                      key={variant.id}
                      className={`font-mono text-[11px] tracking-[0.15em] border px-3 py-1.5 ${
                        variant.availableForSale
                          ? 'text-navy border-navy/30'
                          : 'text-graphite/40 border-navy/10 line-through'
                      }`}
                    >
                      {variant.title.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* REQUISITION ITEM CTA */}
            <a
              href={shopifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-navy text-aged-cream font-mono text-[11px] tracking-[0.3em] text-center py-4 border-[2.5px] border-navy hover:bg-signal-red hover:border-signal-red transition-colors duration-200"
            >
              REQUISITION ITEM
            </a>

            <p className="font-mono text-[11px] tracking-[0.15em] text-graphite/60 text-center mt-3">
              SECURE CHECKOUT VIA SHOPIFY
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
