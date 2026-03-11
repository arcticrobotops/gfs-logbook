export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-aged-cream mt-12">
      {/* Double-rule top: thin then thick */}
      <div className="h-[1px] bg-navy/40" />
      <div className="h-[3px] bg-navy mt-[2px]" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* OFFICIAL MANIFEST stamp */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="flex-1 h-px bg-brass/30" />
          <p className="font-mono text-xs sm:text-xs tracking-[0.25em] sm:tracking-[0.35em] text-brass font-semibold whitespace-nowrap">
            &#9670; OFFICIAL MANIFEST &#9670;
          </p>
          <div className="flex-1 h-px bg-brass/30" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Station manifest */}
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-3">
              STATION MANIFEST
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-navy leading-relaxed font-semibold">
              GHOST FOREST SURF CLUB
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-1">
              NESKOWIN, OR 97149
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              COLDWATER SURF GOODS
            </p>
          </div>

          {/* Coordinates */}
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-3">
              COORDINATES
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite leading-relaxed">
              LAT: 45.10&deg;N
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              LON: 123.98&deg;W
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-1">
              PACIFIC NORTHWEST SECTOR
            </p>
          </div>

          {/* Transmission */}
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-3">
              TRANSMISSION
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite leading-relaxed">
              FREQ: 156.800 MHZ CH-16
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              CALL SIGN: WXJ-4519
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              STATUS: OPERATIONAL
            </p>
          </div>

          {/* Station info */}
          <div>
            <p className="font-mono text-xs tracking-[0.25em] text-brass mb-3">
              STATION INFO
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite leading-relaxed">
              EST. 2024
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              STATION CLASS: SURF
            </p>
            <p className="font-mono text-xs tracking-[0.12em] text-graphite mt-0.5">
              DISTRICT: TILLAMOOK
            </p>
          </div>
        </div>

        {/* Brass rule */}
        <div className="flex items-center gap-2 mt-10 mb-4">
          <div className="flex-1 h-px bg-brass/20" />
          <span className="font-mono text-xs text-brass/40">&#9632;</span>
          <div className="flex-1 h-px bg-brass/20" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-mono text-xs tracking-[0.15em] text-graphite">
            COAST STATION LOG <span className="text-brass/50">&#9670;</span> GHOST FOREST SURF CLUB <span className="text-brass/50">&#9670;</span> {year}
          </p>
          <p className="font-mono text-xs tracking-[0.15em] text-graphite">
            ALL INVENTORY SUBJECT TO AVAILABILITY
          </p>
        </div>
      </div>

      {/* Double-rule bottom */}
      <div className="h-[3px] bg-navy" />
      <div className="h-[1px] bg-navy/40 mt-[2px]" />
    </footer>
  );
}
