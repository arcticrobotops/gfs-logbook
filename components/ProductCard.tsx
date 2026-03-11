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
      className="group block border-2 border-navy bg-aged-cream transition-colors hover:border-signal-red"
    >
      {/* Item number header */}
      <div className="px-3 pt-3 pb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] text-graphite">
          ITEM {itemNumber}
        </span>
      </div>

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

      {/* Product info */}
      <div className="px-3 pt-3 pb-4">
        {/* Department / Collection */}
        {collection && (
          <p className="font-mono text-[9px] tracking-[0.2em] text-graphite mb-1.5">
            DEPT: {collection.title.toUpperCase()}
          </p>
        )}

        {/* Product title */}
        <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-navy uppercase leading-snug mb-2">
          {product.title}
        </h3>

        {/* Price */}
        <p className="font-mono text-xs tracking-[0.1em] text-navy">
          ISSUED AT: ${formattedPrice}
        </p>
      </div>
    </a>
  );
}
