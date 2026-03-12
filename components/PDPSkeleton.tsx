export default function PDPSkeleton() {
  return (
    <main className="min-h-screen bg-aged-cream text-navy animate-pulse">
      <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
        <div className="h-3 w-36 bg-navy/10" />
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="double-rule-top pt-4 mb-8">
          <div className="flex items-center justify-between mb-1">
            <div className="h-3 w-24 bg-navy/10" />
            <div className="h-3 w-40 bg-navy/10" />
          </div>
          <div className="h-px bg-navy/10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <div className="border-[2.5px] border-navy/10">
              <div className="px-3 py-2 border-b border-navy/10">
                <div className="h-3 w-32 bg-navy/10" />
              </div>
              <div className="aspect-[3/4] bg-navy/5" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border border-navy/10 aspect-square bg-navy/5" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-7 w-3/4 bg-navy/10" />
            <div className="h-6 w-32 bg-navy/10" />
            <div className="border-[2px] border-navy/10 h-44" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-navy/10" />
              <div className="h-3 w-5/6 bg-navy/10" />
              <div className="h-3 w-3/4 bg-navy/10" />
            </div>
            <div className="h-14 bg-navy/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
