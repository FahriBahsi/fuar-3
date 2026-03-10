import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/common/BackToTop';
import { Providers } from '@/components/common/Providers';
import { SITE_CONFIG } from '@/lib/constants';

// Get basePath from environment variable
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'directory',
    'listing',
    'business',
    'restaurant',
    'hotel',
    'services',
    'local businesses',
  ],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  icons: {
    icon: basePath + '/images/fevicon.png',
    shortcut: basePath + '/images/fevicon.png',
    apple: basePath + '/images/fevicon.png',
  },
  manifest: basePath + '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of unstyled content and add JS detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('direo-theme');
                if (theme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
                // Add js-enabled class to body for CSS targeting
                document.documentElement.classList.add('js-enabled');
              })();
            `,
          }}
        />
        {/* Google Fonts - Same as original template */}
        <link
          href="https://fonts.googleapis.com/css?family=Muli:400,400i,600,700"
          rel="stylesheet"
        />
        
        {/* Production CSS - Exactly as in demo */}
        {/* plugin.min.css includes: Bootstrap (customized), Font Awesome, Line Awesome, and all vendor CSS */}
        <link rel="stylesheet" href={basePath + '/css/plugin.min.css'} />
        {/* style.css includes: All Direo custom styles with Bootstrap overrides */}
        <link rel="stylesheet" href={basePath + '/css/style.css'} />
        {/* direo.css includes: Additional Direo styles including go_top button */}
        <link rel="stylesheet" href={basePath + '/css/direo.css'} />
        
        {/* React Select Custom Styles */}
        <style>{`
          .react-select__control {
            min-height: 46px !important;
          }
          .react-select__menu {
            z-index: 100 !important;
          }
        `}</style>
      </head>
      <body>
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <Providers>
          {/* Main Content - Header handled per page */}
          <main id="main-content">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Back to top button */}
          <BackToTop />
        </Providers>

        {/* All functionality now handled by React components - no external scripts needed */}
      </body>
    </html>
  );
}
