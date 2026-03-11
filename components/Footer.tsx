export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-aged-cream mt-12">
      {/* Thick top rule */}
      <div className="h-[3px] bg-navy" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Station manifest */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-brass mb-3">
              STATION MANIFEST
            </p>
            <p className="font-mono text-[11px] tracking-[0.12em] text-navy leading-relaxed">
              GHOST FOREST SURF CLUB
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-graphite mt-1">
              NESKOWIN, OR
            </p>
          </div>

          {/* Coordinates */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-brass mb-3">
              COORDINATES
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-graphite leading-relaxed">
              45.10°N, 123.98°W
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-graphite mt-1">
              PACIFIC NORTHWEST SECTOR
            </p>
          </div>

          {/* Station info */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] text-brass mb-3">
              STATION INFO
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-graphite leading-relaxed">
              EST. 2024
            </p>
            <p className="font-mono text-[10px] tracking-[0.12em] text-graphite mt-1">
              COLDWATER SURF GOODS
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-4 border-t border-navy/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="font-mono text-[9px] tracking-[0.15em] text-graphite">
              COAST STATION LOG — GHOST FOREST SURF CLUB — {year}
            </p>
            <p className="font-mono text-[9px] tracking-[0.15em] text-graphite">
              ALL INVENTORY SUBJECT TO AVAILABILITY
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
