import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-aged-cream flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="border-[2.5px] border-navy">
          <div className="px-4 py-2 border-b-[1.5px] border-navy/20 flex items-center justify-between">
            <span className="font-mono text-xs tracking-[0.25em] text-navy font-bold">
              ITEM RECORD
            </span>
            <span className="font-mono text-xs tracking-[0.2em] text-brass">
              NOT FOUND
            </span>
          </div>
          <div className="px-6 py-10 text-center">
            <p className="font-mono text-[72px] leading-none text-navy/10 font-bold mb-2">
              404
            </p>
            <h1 className="font-sans text-lg font-bold tracking-[0.08em] text-navy uppercase mb-4">
              Record Not Located
            </h1>
            <div className="h-px bg-navy/10 mb-4" />
            <p className="font-mono text-xs tracking-[0.12em] text-graphite/70 leading-relaxed mb-8">
              This item does not appear in the station log. It may have been removed or the entry number is incorrect.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-graphite hover:text-signal-red transition-colors min-h-[44px]"
            >
              <span>&larr;</span>
              <span>RETURN TO STATION LOG</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
