import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import SEO from "@/components/SEO";

const ShopPricesPage = () => {
  const router = useRouter();
  const regionBlacklist = [
    "Unknown",
    "None",
    "Bahía de Oro - Villa disctrict",
    "Rabin's Jungle",
    "Swamp",
  ];

  const sorting = [
    "Small Island",
    "Archipelago",
    "Callejon",
    "Jungle",
    "Slav's Bay",
    "Paraíso Peninsular",
    "La Colina Sangrienta",
    "Dueño del Mar",
    "Volcano Island",
    "Bahía de Oro - Downtown",
    "Bahía de Oro - Favela",
    "Casino",
  ];

  const seoProps = {
    title: "Shop Prices | DDSFAQ",
    description: "Browse comprehensive shop prices for all regions in Drug Dealer Simulator 2. Find detailed pricing information, stock levels, item availability, and regional variations. Compare prices across 12+ game areas to maximize your profits.",
    keywords: "shop prices, Drug Dealer Simulator 2, DDS2, regions, items, stock levels, pricing guide, game economy, walkthrough, strategy, profits",
    breadcrumbs: [
      {
        name: "Home",
        url: "https://dds.yonga.dev"
      },
      {
        name: "Shop Prices",
        url: "https://dds.yonga.dev/shop-prices"
      }
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Drug Dealer Simulator 2 Shop Prices",
      "description": "Comprehensive shop price guide for Drug Dealer Simulator 2 covering all regions and items",
      "url": "https://dds.yonga.dev/shop-prices",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Game Regions with Shop Price Data",
        "itemListElement": sorting.map((region, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": `${region} Shop Prices`,
          "url": `https://dds.yonga.dev/shop-prices/${region.toLowerCase().replace(/ /g, '-')}`
        }))
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        flexDirection: "column",
        gap: "0.5rem",
        textAlign: "center",
      }}
    >
      <SEO {...seoProps} />
      <h1>Drug Dealer Simulator 2 | Interactive FAQ</h1>
      <h2>Shop Prices</h2>
      <h3>Choose a Region</h3>
      <Button
        key={"back"}
        label={"Back"}
        trigger={() => {
          router.push("/");
        }}
      />
      <Button
        key={"search"}
        label={"🔎 Search Items"}
        trigger={() => {
          router.push(`/shop-prices/search`);
        }}
      />
      {Object.keys(shops)
        .filter(region => !regionBlacklist.includes(region))
        .sort((a, b) => sorting.indexOf(a) - sorting.indexOf(b))
        .map(region => {
          return (
            <Button
              key={region}
              label={region}
              trigger={() => {
                router.push(`/shop-prices/${region.replaceAll(/ /g, "_")}`);
              }}
            />
          );
        })}
    </div>
  );
};

export default ShopPricesPage;
