import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import SEO from "@/components/SEO";

export default function FAQSelection() {
  const router = useRouter();

  const seoProps = {
    title: "Interactive FAQ Selection | DDSFAQ",
    description: "Choose between Drug Dealer Simulator 1 and 2 interactive FAQ systems. Browse 200+ comprehensive questions and answers with dynamic search, alphabetical navigation, and card-based interface. Find solutions for gameplay, strategies, and troubleshooting.",
    keywords: "FAQ selection, drug dealer simulator, DDS1, DDS2, interactive FAQ, game help, walkthrough, troubleshooting, game strategies",
    breadcrumbs: [
      {
        name: "Home",
        url: "https://dds.yonga.dev"
      },
      {
        name: "FAQ Selection",
        url: "https://dds.yonga.dev/faq"
      }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Drug Dealer Simulator FAQ Selection",
      "description": "Interactive FAQ selection for Drug Dealer Simulator 1 and 2 with comprehensive questions and answers",
      "url": "https://dds.yonga.dev/faq",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Drug Dealer Simulator 1 FAQ",
            "url": "https://dds.yonga.dev/faq/dds1"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Drug Dealer Simulator 2 FAQ",
            "url": "https://dds.yonga.dev/faq/dds2"
          }
        ]
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        flexDirection: "column",
        gap: "2rem",
        textAlign: "center",
        backgroundColor: "#111",
      }}
    >
      <SEO {...seoProps} />

      <header
        style={{
          textAlign: "center",
          padding: "2rem 0",
          background: "#222",
          color: "#fff",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem" }}>
          Drug Dealer Simulator | Interactive FAQ
        </h1>
        <p style={{ margin: "0.5rem 0 0 0", opacity: 0.8 }}>
          Choose your game to browse the FAQ
        </p>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          alignItems: "center",
          marginTop: "6rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#FFCC00" }}>
            Select Game Version
          </h2>
          <p style={{ margin: "1rem 0 0 0", opacity: 0.7 }}>
            Browse frequently asked questions and comprehensive guides
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            label="Drug Dealer Simulator 1"
            trigger={() => {
              router.push("/faq/dds1");
            }}
            variant="outline"
            style={{
              padding: "1.5rem 2rem",
              fontSize: "1.2rem",
              minWidth: "300px",
              height: "auto",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              color: "#fff",
              borderColor: "#FFCC00",
            }}
          />

          <Button
            label="Drug Dealer Simulator 2"
            trigger={() => {
              router.push("/faq/dds2");
            }}
            variant="outline"
            style={{
              padding: "1.5rem 2rem",
              fontSize: "1.2rem",
              minWidth: "300px",
              height: "auto",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
              color: "#fff",
              borderColor: "#FFCC00",
            }}
          />
        </div>
      </div>

      <Button
        label="Back to Home"
        trigger={() => {
          router.push("/");
        }}
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}
