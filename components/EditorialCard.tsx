import Image from 'next/image';

interface EditorialCardProps {
  imageUrl: string;
  alt: string;
  date?: string;
  caption?: string;
  frameNumber?: number;
}

const EDITORIAL_CONTENT: Omit<EditorialCardProps, 'frameNumber'>[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40e7a78?w=800&q=80',
    alt: 'Morning surf session at the Oregon coast',
    date: 'MAR 2024',
    caption: 'Dawn patrol. Station 45N. Glass conditions, light offshore winds. Crew deployed to south point. All equipment serviceable.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=800&q=80',
    alt: 'Coastal forest meeting the Pacific',
    date: 'FEB 2024',
    caption: 'The ghost forest stands watch. Tide receding past the Sitka spruce. Visibility unlimited. Station perimeter secure.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Surf gear laid out on the beach',
    date: 'JAN 2024',
    caption: 'Quarterly inventory check complete. All equipment inspected and cataloged. 3 boards rotated to reserve. Manifest updated.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    alt: 'Winter swell on the Oregon coast',
    date: 'DEC 2023',
    caption: 'Heavy NW swell. 12ft at 16 seconds. Station personnel on standby. Conditions: advanced only. Advisory posted.',
  },
];

export function getEditorialContent(index: number): EditorialCardProps {
  return { ...EDITORIAL_CONTENT[index % EDITORIAL_CONTENT.length], frameNumber: index + 1 };
}

export default function EditorialCard({ imageUrl, alt, date, caption, frameNumber = 1 }: EditorialCardProps) {
  const frameNum = String(frameNumber).padStart(3, '0');

  return (
    <div className="border-2 border-navy bg-aged-cream">
      {/* Header with classification stamp */}
      <div className="px-3 pt-3 pb-2 border-b border-navy/20 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-mono text-[10px] tracking-[0.2em] text-signal-red font-semibold">
              FIELD REPORT
            </p>
            <span className="font-mono text-[7px] text-brass">&#9670;</span>
            <p className="font-mono text-[10px] tracking-[0.2em] text-navy">
              PHOTOGRAPH
            </p>
          </div>
          <p className="font-mono text-[9px] tracking-[0.15em] text-graphite mt-0.5">
            DATE: {date || 'MAR 2024'} / STATION: 45&deg;N
          </p>
        </div>
        {/* Film frame number */}
        <p className="font-mono text-[9px] tracking-[0.2em] text-brass font-semibold">
          FR. {frameNum}
        </p>
      </div>

      {/* Image with film frame markers */}
      <div className="relative w-full overflow-hidden h-[240px] sm:h-[340px]">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Film frame corner marks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-aged-cream/60" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-aged-cream/60" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-aged-cream/60" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-aged-cream/60" />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 py-3 border-t border-navy/20">
          <p className="font-mono text-[9px] tracking-[0.1em] text-graphite leading-relaxed">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
