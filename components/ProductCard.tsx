import Image from 'next/image';
import { ShopifyProduct } from '@/types/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const formattedPrice = price % 1 === 0 ? price.toFixed(0) : price.toFixed(2);
  const collection = product.collections.edges[0]?.node;
  const itemNumber = String(index + 1).padStart(3, '0');

  const productUrl = product.onlineStoreUrl || `https://ghostforestsurfclub.com/products/${product.handle}`;

  return (
    <a
      href={productUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border-[2.5px] border-navy bg-aged-cream transition-colors hover:border-signal-red"
    >
      {/* Item number header */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.25em] text-navy font-semibold">
          ITEM {itemNumber}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-brass">
          &#9670;
        </span>
      </div>

      {/* Divider */}
      <div className="h-[1.5px] bg-navy/20" />

      {/* Product image */}
      {image && (
        <div className="relative w-full overflow-hidden" style={{ height: '310px' }}>
          <Image
            src={image.url}
            alt={image.altText || product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}

      {/* Divider */}
      <div className="h-[1.5px] bg-navy/20" />

      {/* Product info */}
      <div className="px-3 pt-3 pb-4">
        {/* Department / Collection */}
        {collection && (
          <p className="font-mono text-[9px] tracking-[0.25em] text-graphite mb-2">
            DEPT: {collection.title.toUpperCase()}
          </p>
        )}

        {/* Product title */}
        <h3 className="font-sans text-[13px] font-bold tracking-[0.08em] text-navy uppercase leading-snug mb-3">
          {product.title}
        </h3>

        {/* Separator dot */}
        <div className="w-full h-px bg-navy/10 mb-3" />

        {/* Price */}
        <p className="font-mono text-xs tracking-[0.15em] text-navy font-medium">
          ISSUED AT: <span className="text-signal-red">${formattedPrice}</span>
        </p>
      </div>
    </a>
  );
}
