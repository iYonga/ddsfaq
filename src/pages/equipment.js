import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import equipment from "@/resources/equipment.json";
import Head from "next/head";

const index = () => {
  const router = useRouter();
  const sorting = ["Tier 1", "Tier2", "Tier 3", "Tier 4", "Tier 5", "No Tier"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        flexDirection: "column",
        gap: "1rem",
        textAlign: "center",
      }}
    >
      <Head>
        <title>Equipment Tiers | DDSFAQ</title>
        <meta
          name="description"
          content="Equipment tier information for Drug Dealer Simulator 2. Browse different equipment tiers and their specifications."
        />

        {/* OpenGraph Meta Tags */}
        <meta
          property="og:title"
          content="Equipment Tiers | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          property="og:description"
          content="Equipment tier information for Drug Dealer Simulator 2. Browse different equipment tiers and their specifications."
        />
        <meta property="og:url" content="https://dds.yonga.dev/equipment" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:title"
          content="Equipment Tiers | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          name="twitter:description"
          content="Equipment tier information for Drug Dealer Simulator 2. Browse different equipment tiers and their specifications."
        />

        <link rel="canonical" href="https://dds.yonga.dev/equipment" />
      </Head>
      <h1>Drug Dealer Simulator 2 | Interactive FAQ</h1>
      <h2>Equipment Tiers</h2>
      <h3>Choose a Tier</h3>
      <button
        key={"back"}
        label={"Back"}
        trigger={() => {
          router.push("/");
        }}
      />
      {sorting
        .sort((a, b) => sorting.indexOf(a) - sorting.indexOf(b))
        .map(tier => {
          return (
            <Button
              key={tier}
              label={tier}
              trigger={() => {
                router.push(`/equipment/${tier}`);
              }}
            />
          );
        })}
    </div>
  );
};
export default index;
