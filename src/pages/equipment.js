import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import equipment from "@/resources/equipment.json";
import SEO from "@/components/SEO";

const EquipmentPage = () => {
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
      <SEO
        title="Equipment Tiers | DDSFAQ"
        description="Equipment tier information for Drug Dealer Simulator 2. Browse different equipment tiers and their specifications."
        keywords="equipment tiers, Drug Dealer Simulator 2, DDS2, equipment guide, gear tiers, items, weapons, tools, progression, equipment specs"
        canonical="https://dds.yonga.dev/equipment"
        breadcrumbs={[
          {
            name: "Home",
            url: "https://dds.yonga.dev"
          },
          {
            name: "Equipment Tiers",
            url: "https://dds.yonga.dev/equipment"
          }
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Drug Dealer Simulator 2 Equipment Tiers",
          "description": "Comprehensive equipment tier guide for Drug Dealer Simulator 2",
          "url": "https://dds.yonga.dev/equipment",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Equipment Tier Categories",
            "itemListElement": sorting.map((tier, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": `${tier} Equipment`,
              "url": `https://dds.yonga.dev/equipment/${tier.toLowerCase().replace(/ /g, '-')}`
            }))
          }
        }}
      />
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
export default EquipmentPage;
