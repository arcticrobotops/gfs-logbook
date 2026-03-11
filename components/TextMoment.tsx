interface TextMomentProps {
  variant?: 'dark' | 'light';
  heading?: string;
  timestamp?: string;
  body: string;
  entryNumber?: number;
}

const TEXT_MOMENTS: Omit<TextMomentProps, 'entryNumber'>[] = [
  {
    variant: 'dark',
    heading: 'NESKOWIN DAWN PATROL',
    timestamp: '0545 HRS / PROPOSAL ROCK',
    body: 'Fog sitting heavy on the ghost forest. Sitka spruces just shadows at the tideline. 48-degree water, glass from the rock to the point. One truck in the lot. The kind of morning that makes you forget everything except the next set.',
  },
  {
    variant: 'light',
    heading: 'WORKSHOP NOTE',
    timestamp: '1430 HRS / THE SHED',
    body: 'Pulled the winter wetsuits off the rack for final inspection. Every seam taped twice, every zipper salt-tested. If it can\u2019t handle a February session at Proposal Rock, it doesn\u2019t leave the workshop. Standards are the standards.',
  },
  {
    variant: 'dark',
    heading: 'TIDE LOG',
    timestamp: '0630 HRS / CAPE LOOKOUT',
    body: 'Where the Nestucca meets the Pacific, the water turns copper in the first light. 6-8ft, 14 seconds, building out of the northwest. The kind of swell that separates the lineup from the parking lot. Drove the coast road from Tillamook at first light.',
  },
  {
    variant: 'light',
    heading: 'END OF SEASON',
    timestamp: '1800 HRS / STATION 45\u00b0N',
    body: 'Everything we build starts with the same question: would you trust it in the coldest water you\u2019ve ever paddled into? The ghost forest keeps score. The Pacific doesn\u2019t grade on a curve. Another winter logged.',
  },
];

export function getTextMoment(index: number): TextMomentProps {
  return { ...TEXT_MOMENTS[index % TEXT_MOMENTS.length], entryNumber: index + 1 };
}

export default function TextMoment({ variant = 'dark', heading, timestamp, body, entryNumber = 1 }: TextMomentProps) {
  const isDark = variant === 'dark';
  const entryNum = String(entryNumber).padStart(3, '0');

  return (
    <div
      className={`border-2 p-5 sm:p-7 flex flex-col justify-center min-h-[220px] ${
        isDark
          ? 'bg-navy border-navy text-aged-cream'
          : 'bg-aged-cream border-navy text-navy'
      }`}
    >
      {/* Entry number */}
      <p
        className={`font-mono text-xs tracking-[0.3em] font-semibold mb-2 ${
          isDark ? 'text-brass' : 'text-brass'
        }`}
      >
        LOG ENTRY NO. {entryNum}
      </p>

      {/* Brass separator */}
      <div className={`flex items-center gap-2 mb-3 ${isDark ? 'opacity-40' : 'opacity-30'}`}>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
        <span className="font-mono text-xs text-brass">&#9670;</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
      </div>

      {heading && (
        <p
          className={`font-mono text-xs tracking-[0.25em] mb-1 ${
            isDark ? 'text-aged-cream/70' : 'text-signal-red'
          }`}
        >
          {heading}
        </p>
      )}
      {timestamp && (
        <p className={`font-mono text-xs tracking-[0.1em] mb-3 ${isDark ? 'text-aged-cream/50' : 'text-graphite/60'}`}>
          {timestamp}
        </p>
      )}
      <p className="font-sans text-sm leading-relaxed">
        {body}
      </p>

      {/* Bottom brass separator */}
      <div className={`flex items-center gap-2 mt-4 ${isDark ? 'opacity-30' : 'opacity-20'}`}>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
        <span className="font-mono text-xs text-brass">&#9632;</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
      </div>
    </div>
  );
}
