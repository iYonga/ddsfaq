import React from "react";
import Button from "@/components/pickles/Button";
import FeatureCard from "@/components/pickles/FeatureCard";
import { useRouter } from "next/router";
import SEO from "@/components/SEO";
import styles from "@/styles/HomePage.module.css";

const HomePage = () => {
  const router = useRouter();

  // Feature data for cards
  const features = [
    {
      title: "Interactive FAQ",
      description:
        "Browse comprehensive questions and answers for both DDS1 and DDS2 with search and filtering.",
      onClick: () => router.push("/faq"),
    },
    {
      title: "Shop Prices",
      description:
        "Explore detailed pricing information across all regions with shop data and item availability.",
      onClick: () => router.push("/shop-prices"),
    },

    {
      title: "Drug Demands",
      description:
        "Track market demands and optimize your business strategy with regional data.",
      onClick: () => router.push("/demands"),
    },
    /*
        {
      title: "Interactive Map",
      description: "Navigate the complete game world with location markers and points of interest.",
      onClick: () => router.push("/map")
    },
    {
      title: "Common Questions",
      description: "Quick access to frequently asked questions and explanations for common gameplay issues.",
      onClick: () => router.push("/common-questions")
    },
    {
      title: "Bugs & Fixes",
      description: "Find solutions to known technical issues and troubleshooting tips for a smooth gaming experience.",
      onClick: () => router.push("/common-bugs")
    }
      */
  ];

  const seoProps = {
    title: "DDSFAQ - Drug Dealer Simulator Interactive FAQ",
    description:
      "The ultimate interactive FAQ and guide for Drug Dealer Simulator 1 and 2. Find comprehensive shop prices, dynamic FAQ search, game strategies, and detailed walkthroughs. Your complete resource for mastering both DDS1 and DDS2.",
    keywords:
      "home, drug dealer simulator, DDS1, DDS2, interactive FAQ, game guide, shop prices, walkthrough, tips, tricks",
    breadcrumbs: [
      {
        name: "Home",
        url: "https://dds.yonga.dev",
      },
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "DDSFAQ - Drug Dealer Simulator Interactive FAQ",
      description:
        "Complete interactive FAQ and guide for Drug Dealer Simulator 1 and 2",
      url: "https://dds.yonga.dev",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://dds.yonga.dev/faq/{search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      author: {
        "@type": "Organization",
        name: "DDSFAQ",
      },
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1>Drug Dealer Simulator FAQ</h1>
          <p className="subtitle">
            Your complete guide for DDS1 and DDS2 with interactive FAQs, shop
            prices, maps, and strategies.
          </p>
        </section>

        {/* Feature Cards */}
        <section className={styles.features}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card"
                onClick={feature.onClick}
                style={{
                  background: "var(--light-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "0.5rem",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary-color)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <h3
                  style={{
                    color: "var(--foreground)",
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    textAlign: "center",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    margin: "0 0 1rem 0",
                    fontSize: "0.9rem",
                    lineHeight: "1.4",
                    textAlign: "center",
                    flex: "1",
                  }}
                >
                  {feature.description}
                </p>
                <div style={{ textAlign: "center" }}>
                  <Button
                    label="View"
                    variant="outline"
                    size="small"
                    trigger={feature.onClick}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* External Link Button */}
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Button
              label="Knowledge Base"
              variant="outline"
              trigger={() => {
                const url =
                  "https://docs.google.com/document/d/1J-RtTgDRv6Qipjm3BoPLdx9C4uAoFxV4f94PqxGD3SQ";
                window.open(url, "_blank");
              }}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p className="author">Created by Yonga</p>
          <p className="version">Up to date as of DDS2 v1.1 + Casino DLC</p>
        </footer>
      </div>
    </>
  );
};

export default HomePage;

function formatNumber(num) {
  num = typeof num === "number" ? num : Number(num);
  if (isNaN(num)) return "0";
  if (num < 1000) return num.toFixed(0);
  let divisor = 1;
  let suffix = "";
  if (num >= 1e12) {
    divisor = 1e12;
    suffix = "T";
  } else if (num >= 1e9) {
    divisor = 1e9;
    suffix = "B";
  } else if (num >= 1e6) {
    divisor = 1e6;
    suffix = "M";
  } else if (num >= 1e3) {
    divisor = 1e3;
    suffix = "K";
  }
  return (num / divisor).toFixed(2) + suffix;
}
