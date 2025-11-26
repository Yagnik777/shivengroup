// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* SEO Title — browsers & screen readers */}
        <title>Shivengroup | Jobs & Hiring — Engineering, Construction & Infrastructure</title>

        {/* Description */}
        <meta
          name="description"
          content="Shivengroup — find jobs in engineering, construction and infrastructure. Apply to openings and manage applications."
        />

        {/* Canonical */}
        <link rel="canonical" href="https://shivengroup.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="Shivengroup | Jobs & Hiring" />
        <meta property="og:description" content="Find engineering & construction jobs at Shivengroup." />
        <meta property="og:image" content="https://shivengroup.com/og-image.jpg" />
        <meta property="og:url" content="https://shivengroup.com" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Shivengroup | Jobs & Hiring" />
        <meta name="twitter:description" content="Find engineering & construction jobs at Shivengroup." />
        <meta name="twitter:image" content="https://shivengroup.com/og-image.jpg" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://shivengroup.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Preload / deferred CSS — improve LCP */}
        <link rel="preload" href="/css/6b170fe0b75f4859.css" as="style" />
        <link rel="stylesheet" href="/css/6b170fe0b75f4859.css" media="print" onLoad="this.media='all'" />
        <noscript>
          <link rel="stylesheet" href="/css/6b170fe0b75f4859.css" />
        </noscript>

        {/* Favicon & manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Theme color */}
        <meta name="theme-color" content="#111827" />

        {/* Structured Data (Organization) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Shivengroup",
              url: "https://shivengroup.com",
              logo: "https://shivengroup.com/logo.png",
              sameAs: ["https://www.facebook.com/", "https://www.linkedin.com/"],
              description: "Shivengroup provides jobs & hiring in engineering, construction and infrastructure."
            }),
          }}
        />

        {/* Small-safe headers via meta tags (server headers are still recommended) */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
