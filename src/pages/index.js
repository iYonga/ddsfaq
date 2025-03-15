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
      <Button
        label="Equipment"
        trigger={() => {
          router.push("/equipment");
        }}
      />
      <h5>by Yonga | Up to date as of DDS2 v1.0.13</h5>
    </div>
  );
};

export default index;

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
