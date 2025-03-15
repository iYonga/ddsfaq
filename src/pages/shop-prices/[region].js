import React from "react";
import { useRouter } from "next/router";

const shopPricesPage = () => {
  const router = useRouter();
  const { region } = router.query;
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
      Shop Prices | {region}
    </div>
  );
};

export default shopPricesPage;
