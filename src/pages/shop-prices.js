import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import Head from "next/head";

const index = () => {
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
      <Head>
        <title>Shop Prices | DDS2FAQ</title>
        <meta
          name="description"
          content="Browse shop prices for all regions in Drug Dealer Simulator 2. Find detailed pricing information, stock levels, and item availability across all game areas."
        />
        <meta
          name="keywords"
          content="Drug Dealer Simulator 2, DDS2, shop prices, regions, items, stock levels, game guide"
        />

        {/* OpenGraph Meta Tags */}
        <meta
          property="og:title"
          content="Shop Prices | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          property="og:description"
          content="Browse shop prices for all regions in Drug Dealer Simulator 2. Find detailed pricing information, stock levels, and item availability across all game areas."
        />
        <meta property="og:url" content="https://dds.yonga.dev/shop-prices" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:title"
          content="Shop Prices | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          name="twitter:description"
          content="Browse shop prices for all regions in Drug Dealer Simulator 2. Find detailed pricing information, stock levels, and item availability across all game areas."
        />

        <link rel="canonical" href="https://dds.yonga.dev/shop-prices" />
      </Head>
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

export default index;
