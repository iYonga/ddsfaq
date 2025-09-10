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
      <h1>Drug Dealer Simulator 2 | Interactive FAQ</h1>{" "}
      <Button
        label="Shop Prices"
        trigger={() => {
          router.push("/shop-prices");
        }}
      />
      {/*       <Button
        label="🗺️ Interactive Map"
        trigger={() => {
          router.push("/map");
        }}
      />
       */}
      <Button
        label="Drug Demands by Region"
        trigger={() => {
          router.push("/demands");
        }}
      />
      <Button
        label="Common Questions"
        trigger={() => {
          router.push("/common-questions");
        }}
      />
      <Button
        label="Common Bugs & Fixes"
        trigger={() => {
          router.push("/common-bugs");
        }}
      />
      <Button
        label="All Links"
        trigger={() => {
          var url =
            "https://docs.google.com/document/d/1J-RtTgDRv6Qipjm3BoPLdx9C4uAoFxV4f94PqxGD3SQ";
          // open in new tab
          window.open(url, "_blank");
        }}
      />
      <h5>by Yonga | Up to date as of DDS2 v1.1 + Casino DLC</h5>
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
