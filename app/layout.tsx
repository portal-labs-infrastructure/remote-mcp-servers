import type { Metadata, Viewport } from 'next';
import Script from 'next/script'; // For Google Analytics
import { Geist } from 'next/font/google';
import './globals.css'; // Assuming you have a global CSS file
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { BASE_URL } from '@/const';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  // == Theme Color for Mobile Browsers ==
  themeColor: '#1976D2',
};

export const metadata: Metadata = {
  // == From your existing code ==
  metadataBase: new URL(BASE_URL), // Base URL for metadata

  // == SEO: Core Meta Tags ==
  title:
    'Remote MCP Servers | Discover Remote Model Context Protocol (MCP) Servers',
  description:
    'Explore a community-maintained list of remote Model Context Protocol (MCP) servers. Find, learn about, and comment on MCP servers.',
  keywords: [
    'MCP',
    'Model Context Protocol',
    'Server Registry',
    'AI Agents',
    'MCP Servers',
    'API',
    'Developer Tools',
    'AI Integration',
  ], // From your meta keywords

  // == Favicon ==
  icons: {
    icon: [
      { url: '/mcp.svg', type: 'image/svg+xml' }, // Matches your existing favicon
      // { url: '/favicon.ico', type: 'image/x-icon', sizes: 'any' } // Example for .ico
    ],
    // apple: '/apple-touch-icon.png', // If you add an Apple touch icon
    // other: [ // For other specific link rel types
    //   { rel: 'other-icon', url: '/other-icon.png' },
    // ],
  },

  // == Canonical URL ==
  alternates: {
    canonical: '/', // This will be combined with metadataBase to form the full URL
    // or explicitly: canonical: 'https://remote-mcp-servers.com/',
  },

  // == SEO: Open Graph / Facebook ==
  openGraph: {
    type: 'website',
    url: '/', // Will be combined with metadataBase
    title:
      'Remote MCP Servers | Discover Remote Model Context Protocol (MCP) Servers',
    description:
      'Explore a community-maintained list of Remote Model Context Protocol (MCP) servers. Find, learn about, and comment on MCP servers.',
    images: [
      {
        url: '/mcp-registry-og-image.png', // Relative to metadataBase, assuming image is in `public` folder
        // or absolute: 'https://remote-mcp-servers.com/mcp-registry-og-image.png'
        width: 1200, // Optional, but recommended for OG
        height: 630, // Optional, but recommended for OG
        alt: 'Remote MCP Servers Open Graph Image', // Optional, but recommended
      },
    ],
    siteName: 'Remote MCP Servers', // From og:site_name
  },

  // == SEO: Twitter Card ==
  twitter: {
    card: 'summary_large_image',
    // url: '/', // Often inferred, but can be explicit. Will be combined with metadataBase.
    title:
      'Remote MCP Servers | Discover Remote Model Context Protocol (MCP) Servers', // Matches Open Graph title
    description:
      'Explore a community-maintained list of Remote Model Context Protocol (MCP) servers. Find, learn about, and comment on MCP servers.', // Matches Open Graph description
    images: ['/mcp-registry-og-image.png'], // Relative to metadataBase, assuming image is in `public` folder
    // or absolute: 'https://remote-mcp-servers.com/mcp-registry-og-image.png'
    // site: '@yourtwitterhandle', // Optional: If you have a site Twitter handle
    // creator: '@creatorhandle', // Optional: If you have a creator Twitter handle
  },
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        <Script
          strategy="afterInteractive" // Or "lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-TTN1VTX19K"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive" // Or "lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TTN1VTX19K', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
