'use client';

/**
 * Global Error Boundary
 * This catches errors at the root level
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Critical Error - Direo Next.js</title>
        {/* Load minimal CSS for error page */}
        <link rel="stylesheet" href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '/css/plugin.min.css'} />
        <link rel="stylesheet" href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '/css/style.css'} />
        <link rel="stylesheet" href={(process.env.NEXT_PUBLIC_BASE_PATH || '') + '/css/direo.css'} />
      </head>
      <body>
        <div className="error-page-container">
          <div className="error-page-content">
            <div className="error-page-icon">💥</div>
            
            <h1 className="error-page-title">
              Critical Error
            </h1>
            
            <p className="error-page-message">
              The application encountered a critical error. Please try reloading the page.
            </p>

            <button
              onClick={reset}
              className="error-page-button"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

