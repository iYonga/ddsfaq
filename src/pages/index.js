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
      <h1>Drug Dealer Simulator 2 | Interactive FAQ</h1>
      <Button
        label="Shop Prices"
        trigger={() => {
          router.push("/shop-prices");
        }}
      />
      <h5>by Yonga | Up to date as of DDS2 v1.0.13</h5>
    </div>
  );
};

export default index;
