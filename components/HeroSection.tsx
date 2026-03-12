import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden border-b-[2.5px] border-navy">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
        <Image
          src="https://images.unsplash.com/photo-1513553404607-988bf2703777?w=1920&q=80"
          alt="Rugged Oregon coast with sea stacks and misty Pacific Northwest shoreline"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-navy/15" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14 md:pb-16 px-4 text-center">
          <p className="font-mono text-xs tracking-[0.2em] sm:tracking-[0.4em] text-brass uppercase mb-4">
            Station 45&deg;06&prime;N &mdash; Neskowin, Oregon
          </p>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-aged-cream tracking-wide leading-tight max-w-2xl">
            Coast Station Log
          </h2>
          <p className="mt-4 font-sans text-sm sm:text-base text-aged-cream/70 max-w-lg leading-relaxed">
            Every piece in this manifest was tested in 48-degree water off Proposal Rock before it earned a place in the lineup.
          </p>
          <div className="mt-6">
            <a
              href="#manifest"
              className="inline-block font-mono text-xs tracking-[0.25em] uppercase px-8 py-3 border-[2px] border-aged-cream/40 text-aged-cream hover:bg-aged-cream/10 transition-colors duration-200"
            >
              View Manifest
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
