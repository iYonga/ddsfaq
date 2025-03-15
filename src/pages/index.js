import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
        flexDirection: "column",
        gap: "1rem",
        textAlign: "center",
      }}
    >
      <h1>Drug Dealer Simulator | Interactive FAQ</h1>
      <Button
        label="Shop Prices"
        trigger={() => {
          router.push("/shop-prices");
        }}
      />
    </div>
  );
};

export default index;
