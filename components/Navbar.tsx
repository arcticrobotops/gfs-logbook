'use client';

import { useState } from 'react';
import { ShopifyCollection } from '@/types/shopify';

interface NavbarProps {
  collections: ShopifyCollection[];
  activeCollection: string;
  onCollectionChange: (handle: string) => void;
}

export default function Navbar({ collections, activeCollection, onCollectionChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCollections = collections.filter(
    (c) => c.handle !== 'frontpage' && c.title.toLowerCase() !== 'home'
  );

  return (
    <nav className="sticky top-0 z-50 bg-aged-cream">
      {/* Top thick rule */}
      <div className="h-[3px] bg-navy" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-5">
          {/* Station name */}
          <div className="flex-1">
            <h1 className="font-playfair text-lg sm:text-xl lg:text-2xl font-bold text-navy tracking-wide leading-tight">
              COAST STATION LOG
            </h1>
            <p className="font-mono text-[10px] sm:text-xs text-graphite tracking-[0.2em] mt-0.5">
              GHOST FOREST SURF CLUB
            </p>
          </div>

          {/* Desktop category filters */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onCollectionChange('all')}
              className={`font-mono text-[10px] lg:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                activeCollection === 'all'
                  ? 'bg-navy text-aged-cream border-navy'
                  : 'bg-transparent text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
              }`}
            >
              ALL INVENTORY
            </button>
            {filteredCollections.map((collection) => (
              <button
                key={collection.handle}
                onClick={() => onCollectionChange(collection.handle)}
                className={`font-mono text-[10px] lg:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                  activeCollection === collection.handle
                    ? 'bg-navy text-aged-cream border-navy'
                    : 'bg-transparent text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
                }`}
              >
                {collection.title}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden font-mono text-xs tracking-[0.15em] text-navy border border-navy px-3 py-1.5"
          >
            {mobileMenuOpen ? 'CLOSE' : 'DEPT.'}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-wrap gap-2">
            <button
              onClick={() => { onCollectionChange('all'); setMobileMenuOpen(false); }}
              className={`font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                activeCollection === 'all'
                  ? 'bg-navy text-aged-cream border-navy'
                  : 'bg-transparent text-navy border-navy/30'
              }`}
            >
              ALL INVENTORY
            </button>
            {filteredCollections.map((collection) => (
              <button
                key={collection.handle}
                onClick={() => { onCollectionChange(collection.handle); setMobileMenuOpen(false); }}
                className={`font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${
                  activeCollection === collection.handle
                    ? 'bg-navy text-aged-cream border-navy'
                    : 'bg-transparent text-navy border-navy/30'
                }`}
              >
                {collection.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom thick rule */}
      <div className="h-[3px] bg-navy" />
    </nav>
  );
}
