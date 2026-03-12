'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ShopifyCollection } from '@/types/shopify';

interface NavbarProps {
  collections: ShopifyCollection[];
  activeCollection: string;
  onCollectionChange: (handle: string) => void;
}

export default function Navbar({ collections, activeCollection, onCollectionChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const filteredCollections = collections.filter(
    (c) => c.handle !== 'frontpage' && c.title.toLowerCase() !== 'home'
  );

  // Manage max-height for CSS transition
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    if (mobileMenuOpen) {
      el.style.maxHeight = el.scrollHeight + 'px';
    } else {
      el.style.maxHeight = '0px';
    }
  }, [mobileMenuOpen]);

  // #8: Focus first item on open, return focus to toggle on close
  useEffect(() => {
    if (mobileMenuOpen) {
      // Focus the first button inside the mobile menu
      const firstBtn = menuRef.current?.querySelector('button');
      if (firstBtn) {
        requestAnimationFrame(() => {
          (firstBtn as HTMLElement).focus();
        });
      }
    }
  }, [mobileMenuOpen]);

  // #8: Escape key closes menu and returns focus to toggle
  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false);
      toggleRef.current?.focus();
    }
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-aged-cream" aria-label="Main navigation">
      {/* Double-rule top: thick then thin */}
      <div className="h-[3px] bg-navy" />
      <div className="h-[1px] bg-navy/40 mt-[2px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 sm:py-5">
          {/* Station name + designation */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="font-playfair text-lg sm:text-xl lg:text-2xl font-bold text-navy tracking-wide leading-tight">
                COAST STATION LOG
              </span>
              <span className="hidden sm:inline font-mono text-xs tracking-[0.2em] text-brass">&#9670;</span>
              <span className="hidden sm:inline font-mono text-xs tracking-[0.2em] text-brass font-semibold">
                STATION 45 N
              </span>
            </div>
            <p className="font-mono text-[13px] sm:text-xs text-graphite tracking-[0.12em] sm:tracking-[0.2em] mt-0.5">
              GHOST FOREST SURF CLUB <span className="text-brass">&#9670;</span> NESKOWIN, OR
            </p>
          </div>

          {/* Desktop category filters */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onCollectionChange('all')}
              aria-current={activeCollection === 'all' ? 'true' : undefined}
              className={`font-mono text-xs lg:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                activeCollection === 'all'
                  ? 'bg-navy text-aged-cream border-navy'
                  : 'bg-transparent text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
              }`}
            >
              ALL INVENTORY
            </button>
            {filteredCollections.map((collection) => (
              <span key={collection.handle} className="flex items-center gap-1 lg:gap-2">
                <span className="font-mono text-xs text-brass/50">&#9670;</span>
                <button
                  onClick={() => onCollectionChange(collection.handle)}
                  aria-current={activeCollection === collection.handle ? 'true' : undefined}
                  className={`font-mono text-xs lg:text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                    activeCollection === collection.handle
                      ? 'bg-navy text-aged-cream border-navy'
                      : 'bg-transparent text-navy border-navy/30 hover:border-navy hover:bg-navy/5'
                  }`}
                >
                  {collection.title}
                </button>
              </span>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            ref={toggleRef}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden font-mono text-xs tracking-[0.15em] text-navy border border-navy px-3 py-1.5 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            {mobileMenuOpen ? 'CLOSE' : 'DEPT.'}
          </button>
        </div>

        {/* Mobile menu with CSS transition */}
        {/* #8: aria-hidden when closed */}
        <div
          id="mobile-menu"
          ref={menuRef}
          aria-hidden={!mobileMenuOpen}
          onKeyDown={handleMenuKeyDown}
          className="md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
          style={{ maxHeight: 0, opacity: mobileMenuOpen ? 1 : 0 }}
        >
          <div className="pb-4 flex flex-wrap gap-2">
            <button
              onClick={() => { onCollectionChange('all'); closeMobileMenu(); }}
              aria-current={activeCollection === 'all' ? 'true' : undefined}
              tabIndex={mobileMenuOpen ? 0 : -1}
              className={`font-mono text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
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
                onClick={() => { onCollectionChange(collection.handle); closeMobileMenu(); }}
                aria-current={activeCollection === collection.handle ? 'true' : undefined}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={`font-mono text-xs tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  activeCollection === collection.handle
                    ? 'bg-navy text-aged-cream border-navy'
                    : 'bg-transparent text-navy border-navy/30'
                }`}
              >
                {collection.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Double-rule bottom: thin then thick */}
      <div className="h-[1px] bg-navy/40" />
      <div className="h-[3px] bg-navy mt-[2px]" />
    </nav>
  );
}
