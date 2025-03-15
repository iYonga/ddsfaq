import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";

const index = () => {
  const router = useRouter();
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
      <h1>Drug Dealer Simulator | Interactive FAQ</h1>
      <h2>Shop Prices</h2>
      <h3>Choose a Region</h3>
      {Object.keys(shops).map(region => {
        return (
          <Button
            key={region}
            label={region}
            trigger={() => {
              router.push(`/shop-prices/${region}`);
            }}
          />
        );
      })}
    </div>
  );
};

export default index;
