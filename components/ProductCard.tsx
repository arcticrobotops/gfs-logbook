import Image from 'next/image';
import Link from 'next/link';
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

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block border-2 border-navy bg-aged-cream transition-colors hover:border-signal-red"
    >
      {/* Brass accent top edge */}
      <div className="h-[2px] bg-brass/30 group-hover:bg-brass/50 transition-colors" />

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
        <div className="relative w-full overflow-hidden aspect-[3/4] sm:h-[310px] sm:aspect-auto">
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
      <div className="px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-3 sm:pb-4">
        {/* Department / Collection */}
        {collection && (
          <p className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-graphite mb-1.5 sm:mb-2 truncate">
            DEPT: {collection.title.toUpperCase()}
          </p>
        )}

        {/* Product title */}
        <h3 className="font-sans text-[12px] sm:text-[13px] font-bold tracking-[0.06em] sm:tracking-[0.08em] text-navy uppercase leading-snug mb-2 sm:mb-3 line-clamp-2">
          {product.title}
        </h3>

        {/* Separator dot */}
        <div className="w-full h-px bg-navy/10 mb-2 sm:mb-3" />

        {/* Price */}
        <p className="font-mono text-[11px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] font-medium">
          <span className="hidden sm:inline text-brass/70">ISSUED AT: </span>
          <span className="sm:hidden text-navy/50">$</span>
          <span className="text-navy font-semibold">${formattedPrice}</span>
        </p>
      </div>
    </Link>
  );
}
