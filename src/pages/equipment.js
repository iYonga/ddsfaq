import React from "react";
import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import equipment from "@/resources/equipment.json";

const index = () => {
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
