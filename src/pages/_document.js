import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";

const MyDocument = () => (
  <Html lang="en">
    <Head>
      {/* Basic Meta Tags - NO title/description here, pages override them */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="DDSFAQ" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0B0B0B" />

      {/* Security and Performance */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="DDSFAQ" />

      {/* Application Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Global Keywords */}
      <meta
        name="keywords"
        content="Drug Dealer Simulator 2, DDS2, DDS1, FAQ, interactive guide, shop prices, game guide, simulator, drug dealing, game walkthrough, tips, tricks, walkthrough, gameplay, strategy, wiki, encyclopedia"
      />

      {/* Geographic Targeting */}
      <meta name="geo.region" content="US" />
      <meta name="geo.position" content="39.8283;-98.5795" />

      {/* Content Rating */}
      <meta name="rating" content="mature" />

      {/* Verification Tags (placeholder - add actual verification meta tags when available) */}
      {/* <meta name="google-site-verification" content="" /> */}
      {/* <meta name="msvalidate.01" content="" /> */}

      {/* OpenGraph Meta Tags - Only global ones */}
      <meta property="og:site_name" content="DDSFAQ" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://dds.yonga.dev/cover.png" />
      <meta property="og:image:width" content="3840" />
      <meta property="og:image:height" content="2160" />
      <meta property="og:image:alt" content="Drug Dealer Simulator 2 Interactive FAQ" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:locale" content="en_US" />

      {/* Additional OpenGraph Tags */}
      <meta property="og:see_also" content="https://store.steampowered.com/app/2496210/Drug_Dealer_Simulator_2/" />

      {/* Twitter Card Meta Tags - Only global ones */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://dds.yonga.dev/cover.png" />
      <meta name="twitter:image:alt" content="Drug Dealer Simulator 2 Interactive FAQ" />
      <meta name="twitter:site" content="@DDSFAQ" />
      <meta name="twitter:creator" content="@DDSFAQ" />

      {/* Additional Twitter Tags */}
      <meta name="twitter:app:name:iphone" content="DDSFAQ" />
      <meta name="twitter:app:name:ipad" content="DDSFAQ" />
      <meta name="twitter:app:name:googleplay" content="DDSFAQ" />

      {/* Additional Social Media */}
      <meta property="fb:app_id" content="" /> {/* Add Facebook App ID when available */}
      <meta name="linkedin:owner" content="" /> {/* Add LinkedIn Company ID when available */}

      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DDSFAQ",
            "url": "https://dds.yonga.dev",
            "logo": "https://dds.yonga.dev/cover.png",
            "description": "Comprehensive interactive FAQ and guide for Drug Dealer Simulator games",
            "sameAs": [
              "https://store.steampowered.com/app/2496210/Drug_Dealer_Simulator_2/",
              "https://www.youtube.com/results?search_query=Drug+Dealer+Simulator+2"
            ],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://dds.yonga.dev/faq/{search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Structured Data - Website */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DDSFAQ - Drug Dealer Simulator Interactive FAQ",
            "url": "https://dds.yonga.dev",
            "description": "The ultimate interactive FAQ and guide for Drug Dealer Simulator 1 and 2",
            "author": {
              "@type": "Organization",
              "name": "DDSFAQ"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://dds.yonga.dev/faq/{search_term_string}"
              },
              "query-input": "required name=search_term_string"
            },
            "inLanguage": "en"
          })
        }}
      />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
      <link rel="dns-prefetch" href="//unpkg.com" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

MyDocument.getInitialProps = async ctx => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};

export default MyDocument;
