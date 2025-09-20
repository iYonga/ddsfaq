import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage,
  structuredData,
  noIndex = false,
  hreflang = [],
  breadcrumbs = [],
  faqData = [],
  additionalMeta = [],
}) => {
  const router = useRouter();
  const baseUrl = "https://dds.yonga.dev";
  const currentUrl = `${baseUrl}${router.asPath}`;

  // Default values
  const defaultTitle = "DDSFAQ - Drug Dealer Simulator Interactive FAQ";
  const defaultDescription = "The ultimate interactive FAQ and guide for Drug Dealer Simulator 1 and 2. Find shop prices, comprehensive questions, and detailed game information.";
  const defaultKeywords = "Drug Dealer Simulator 2, DDS2, DDS1, FAQ, interactive guide, shop prices, game guide, simulator, drug dealing, game walkthrough, tips, tricks, walkthrough, gameplay, strategy";
  const defaultImage = `${baseUrl}/cover.png`;

  // Use provided values or defaults
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;
  const finalCanonical = canonical || currentUrl;
  const finalOgImage = ogImage || defaultImage;

  // Generate structured data
  const generateStructuredData = () => {
    const structuredDataArray = [];

    // Basic website structured data
    structuredDataArray.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": finalTitle,
      "description": finalDescription,
      "url": finalCanonical,
      "inLanguage": "en",
      "isPartOf": {
        "@type": "WebSite",
        "name": "DDSFAQ",
        "url": baseUrl
      },
      "breadcrumb": breadcrumbs.length > 0 ? {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      } : undefined
    });

    // FAQ structured data if provided
    if (faqData.length > 0) {
      structuredDataArray.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    // Additional structured data
    if (structuredData) {
      structuredDataArray.push(structuredData);
    }

    return structuredDataArray;
  };

  const structuredDataArray = generateStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="DDSFAQ" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />

      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content="DDSFAQ" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content={finalTitle} />
      <meta name="twitter:site" content="@DDSFAQ" />
      <meta name="twitter:creator" content="@DDSFAQ" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#0B0B0B" />
      <meta name="msapplication-TileColor" content="#0B0B0B" />

      {/* Hreflang Tags */}
      {hreflang.map((lang) => (
        <link
          key={lang.hreflang}
          rel="alternate"
          hreflang={lang.hreflang}
          href={lang.url}
        />
      ))}

      {/* Structured Data */}
      {structuredDataArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data)
          }}
        />
      ))}

      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={index}
          name={meta.name}
          content={meta.content}
          property={meta.property}
        />
      ))}

      {/* Additional OpenGraph Tags */}
      {ogType === "article" && (
        <>
          <meta property="article:author" content="DDSFAQ" />
          <meta property="article:published_time" content={new Date().toISOString()} />
          <meta property="article:modified_time" content={new Date().toISOString()} />
          <meta property="article:section" content="Gaming" />
        </>
      )}
    </Head>
  );
};

export default SEO;