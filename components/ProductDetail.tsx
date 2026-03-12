'use client';

import { useState } from 'react';

interface Variant {
  node: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface ProductDetailProps {
  variants: Variant[];
  shopifyUrl: string;
  initialPrice: number;
  hasVariants: boolean;
}

export default function ProductDetail({
  variants,
  shopifyUrl,
  initialPrice,
  hasVariants,
}: ProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    variants.find((v) => v.node.availableForSale)?.node.id || null,
  );

  const selected = variants.find((v) => v.node.id === selectedVariant);
  const currentPrice = selected
    ? parseFloat(selected.node.price.amount)
    : initialPrice;
  const formattedPrice = currentPrice % 1 === 0 ? currentPrice.toFixed(0) : currentPrice.toFixed(2);
  const isAvailable = selected?.node.availableForSale ?? false;

  return (
    <div className="space-y-6">
      {/* Interactive variant selector */}
      {hasVariants && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs tracking-[0.25em] text-navy font-semibold">
              SELECT OPTION
            </span>
            <div className="flex-1 h-px bg-navy/10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.node.id}
                onClick={() => {
                  if (v.node.availableForSale) {
                    setSelectedVariant(v.node.id);
                  }
                }}
                disabled={!v.node.availableForSale}
                className={`font-mono text-xs tracking-[0.15em] border px-3 py-1.5 transition-colors duration-150 ${
                  v.node.id === selectedVariant
                    ? 'text-signal-red border-signal-red font-semibold bg-signal-red/5'
                    : v.node.availableForSale
                      ? 'text-navy border-navy/30 hover:border-navy hover:bg-navy/5 cursor-pointer'
                      : 'text-graphite/40 border-navy/10 line-through cursor-not-allowed'
                }`}
              >
                {v.node.title.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic price */}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-xs tracking-[0.2em] text-graphite">
          ISSUED AT:
        </span>
        <span className="font-mono text-lg tracking-[0.1em] text-signal-red font-bold">
          ${formattedPrice}
        </span>
        {!isAvailable && selectedVariant && (
          <span className="stamp stamp-red text-xs">UNAVAILABLE</span>
        )}
      </div>

      {/* CTA */}
      <a
        href={shopifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full font-mono text-xs tracking-[0.3em] text-center py-4 border-[2.5px] transition-colors duration-200 ${
          isAvailable
            ? 'bg-navy text-aged-cream border-navy hover:bg-signal-red hover:border-signal-red'
            : 'bg-navy/20 text-navy/40 border-navy/20 cursor-not-allowed pointer-events-none'
        }`}
      >
        {isAvailable ? 'REQUISITION ITEM' : 'CURRENTLY UNAVAILABLE'}
      </a>

      <p className="font-mono text-xs tracking-[0.15em] text-graphite/60 text-center">
        SECURE CHECKOUT VIA SHOPIFY
      </p>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-aged-cream border-t-[2.5px] border-navy px-4 py-4 flex items-center gap-3 safe-area-bottom">
        <div className="flex-1 min-w-[180px]">
          <p className="font-mono text-xs tracking-wider text-graphite/60 uppercase truncate">
            {isAvailable ? 'Ready to ship' : 'Unavailable'}
          </p>
          <p className="font-mono text-sm tracking-wider text-signal-red font-bold">
            ${formattedPrice}
          </p>
        </div>
        <a
          href={shopifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 font-mono text-xs tracking-[0.2em] uppercase px-6 py-3 border-[2px] transition-colors duration-200 ${
            isAvailable
              ? 'bg-navy text-aged-cream border-navy hover:bg-signal-red hover:border-signal-red'
              : 'bg-navy/20 text-navy/40 border-navy/20 pointer-events-none'
          }`}
        >
          {isAvailable ? 'REQUISITION' : 'N/A'}
        </a>
      </div>
    </div>
  );
}
