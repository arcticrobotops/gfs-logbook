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
    heading: 'WEATHER & CONDITIONS',
    timestamp: '0630 HRS / WATCH 1',
    body: 'Offshore winds 8-12kts. 8ft NW swell at 15 sec. Visibility: 2mi, fog clearing by 0800. Water temp: 52\u00b0F. Barometer steady at 30.12. All hands accounted for. Equipment check complete. Wetsuits issued.',
  },
  {
    variant: 'light',
    heading: 'SUPPLY & INVENTORY',
    timestamp: '1430 HRS / WATCH 2',
    body: 'Shipment received via coastal supply route. 12 units cold water equipment cataloged. 4 boards inspected and racked. Manifest updated, serial numbers logged. All items serviceable. Ready for issue to station personnel.',
  },
  {
    variant: 'dark',
    heading: 'DAWN RECON',
    timestamp: '0545 HRS / WATCH 1',
    body: 'Pre-dawn. Fog bank holding at 500yds offshore. Swell building from the NW, 6-8ft at 14 seconds. Tide dropping through low. Glass conditions. Three crew dispatched to south point for observation. Report favorable.',
  },
  {
    variant: 'light',
    heading: 'END OF WATCH',
    timestamp: '1800 HRS / WATCH 3',
    body: 'All equipment secured and inventoried. Surf report filed with regional command. Crew rotation complete. Tomorrow forecast: incoming NW swell, 10ft at 17 seconds. Station personnel to prepare cold water kits accordingly.',
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
        className={`font-mono text-[10px] tracking-[0.3em] font-semibold mb-2 ${
          isDark ? 'text-brass' : 'text-brass'
        }`}
      >
        LOG ENTRY NO. {entryNum}
      </p>

      {/* Brass separator */}
      <div className={`flex items-center gap-2 mb-3 ${isDark ? 'opacity-40' : 'opacity-30'}`}>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
        <span className="font-mono text-[7px] text-brass">&#9670;</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
      </div>

      {heading && (
        <p
          className={`font-mono text-[10px] tracking-[0.25em] mb-1 ${
            isDark ? 'text-aged-cream/70' : 'text-signal-red'
          }`}
        >
          {heading}
        </p>
      )}
      {timestamp && (
        <p className={`font-mono text-[10px] tracking-[0.1em] mb-3 ${isDark ? 'text-aged-cream/50' : 'text-graphite/60'}`}>
          {timestamp}
        </p>
      )}
      <p className="font-sans text-sm leading-relaxed">
        {body}
      </p>

      {/* Bottom brass separator */}
      <div className={`flex items-center gap-2 mt-4 ${isDark ? 'opacity-30' : 'opacity-20'}`}>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
        <span className="font-mono text-[6px] text-brass">&#9632;</span>
        <div className={`flex-1 h-px ${isDark ? 'bg-brass' : 'bg-brass'}`} />
      </div>
    </div>
  );
}
