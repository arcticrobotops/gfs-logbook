import Image from 'next/image';

interface EditorialCardProps {
  imageUrl: string;
  alt: string;
  date?: string;
  caption?: string;
}

const EDITORIAL_CONTENT: EditorialCardProps[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1502680390548-bdbac40e7a78?w=800&q=80',
    alt: 'Morning surf session at the Oregon coast',
    date: 'MAR 2024',
    caption: 'Dawn patrol. Station 45N. Glass conditions, light offshore winds.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=800&q=80',
    alt: 'Coastal forest meeting the Pacific',
    date: 'FEB 2024',
    caption: 'The ghost forest stands. Tide receding. Sitka spruce holding the line.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    alt: 'Surf gear laid out on the beach',
    date: 'JAN 2024',
    caption: 'Inventory check complete. All equipment serviceable. Ready for deployment.',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    alt: 'Winter swell on the Oregon coast',
    date: 'DEC 2023',
    caption: 'Heavy NW swell. 12ft at 16 seconds. Station personnel on standby.',
  },
];

export function getEditorialContent(index: number): EditorialCardProps {
  return EDITORIAL_CONTENT[index % EDITORIAL_CONTENT.length];
}

export default function EditorialCard({ imageUrl, alt, date, caption }: EditorialCardProps) {
  return (
    <div className="border-2 border-navy bg-aged-cream">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-navy/20">
        <p className="font-mono text-[10px] tracking-[0.2em] text-navy">
          STATION LOG — PHOTOGRAPH
        </p>
        <p className="font-mono text-[9px] tracking-[0.15em] text-graphite mt-0.5">
          DATE: {date || 'MAR 2024'} / STATION: 45°N
        </p>
      </div>

      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ height: '340px' }}>
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Caption */}
      {caption && (
        <div className="px-3 py-3">
          <p className="font-sans text-xs text-graphite leading-relaxed italic">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
