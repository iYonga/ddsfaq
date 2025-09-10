import React from "react";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";

const MyDocument = () => (
  <Html lang="en">
    <Head>
      {/* Basic Meta Tags */}
      <title>DDSFAQ - Drug Dealer Simulator 2 Interactive FAQ</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="DDSFAQ" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0B0B0B" />

      {/* Default Meta Tags */}
      <meta
        name="description"
        content="DDSFAQ - Interactive FAQ and guide for Drug Dealer Simulator 2. Browse shop prices, interactive maps, and comprehensive game information."
      />
      <meta
        name="keywords"
        content="Drug Dealer Simulator 2, DDS2, FAQ, interactive guide, shop prices, game guide, simulator"
      />

      {/* OpenGraph Meta Tags */}
      <meta property="og:site_name" content="DDSFAQ" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://dds.yonga.dev/cover.png" />
      <meta property="og:image:width" content="3840" />
      <meta property="og:image:height" content="2160" />
      <meta
        property="og:image:alt"
        content="Drug Dealer Simulator 2 Interactive FAQ"
      />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://dds.yonga.dev/cover.png" />
      <meta
        name="twitter:image:alt"
        content="Drug Dealer Simulator 2 Interactive FAQ"
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
