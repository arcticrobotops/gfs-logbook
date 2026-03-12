import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ghostforestsurfclub.com"),
  title: "Coast Station Log — Ghost Forest Surf Club",
  description: "Maritime inventory of coldwater surf goods. Station 45°N. Neskowin, Oregon.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Coast Station Log — Ghost Forest Surf Club",
    description: "Maritime inventory of coldwater surf goods. Station 45°N. Neskowin, Oregon.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coast Station Log — Ghost Forest Surf Club",
    description: "Maritime inventory of coldwater surf goods. Station 45°N. Neskowin, Oregon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" />
      </head>
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} ${dmSans.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-navy focus:text-aged-cream font-mono text-xs tracking-widest"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
