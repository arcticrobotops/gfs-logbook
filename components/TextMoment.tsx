interface TextMomentProps {
  variant?: 'dark' | 'light';
  heading?: string;
  timestamp?: string;
  body: string;
}

const TEXT_MOMENTS: TextMomentProps[] = [
  {
    variant: 'dark',
    heading: 'STATION LOG ENTRY',
    timestamp: 'Station 45°N. 0630 hrs.',
    body: 'Conditions: offshore, 8ft NW swell. Visibility: 2mi. Water temp: 52°F. All hands accounted for. Equipment check complete.',
  },
  {
    variant: 'light',
    heading: 'STATION LOG ENTRY',
    timestamp: 'Station 45°N. 1430 hrs.',
    body: 'Inventory received from supply. New cold water equipment cataloged and stored. Manifest updated. Ready for issue.',
  },
  {
    variant: 'dark',
    heading: 'STATION LOG ENTRY',
    timestamp: 'Station 45°N. 0545 hrs.',
    body: 'Pre-dawn conditions: fog bank at 500yds. Swell building from the NW, 6-8ft at 14 seconds. Tide dropping. Glass.',
  },
  {
    variant: 'light',
    heading: 'STATION LOG ENTRY',
    timestamp: 'Station 45°N. 1800 hrs.',
    body: 'End of watch. All equipment secured. Surf report filed. Tomorrow: incoming NW swell, 10ft at 17 seconds. Prepare accordingly.',
  },
];

export function getTextMoment(index: number): TextMomentProps {
  return TEXT_MOMENTS[index % TEXT_MOMENTS.length];
}

export default function TextMoment({ variant = 'dark', heading, timestamp, body }: TextMomentProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`border-2 p-6 sm:p-8 flex flex-col justify-center min-h-[200px] ${
        isDark
          ? 'bg-navy border-navy text-aged-cream'
          : 'bg-aged-cream border-navy text-navy'
      }`}
    >
      {heading && (
        <p
          className={`font-mono text-[10px] tracking-[0.25em] mb-3 ${
            isDark ? 'text-brass' : 'text-signal-red'
          }`}
        >
          {heading}
        </p>
      )}
      {timestamp && (
        <p className="font-mono text-xs tracking-[0.1em] mb-3 opacity-70">
          {timestamp}
        </p>
      )}
      <p className="font-sans text-sm leading-relaxed">
        {body}
      </p>
    </div>
  );
}
