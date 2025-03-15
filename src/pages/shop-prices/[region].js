import React from "react";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/numerology";
import Button from "@/components/pickles/Button";
import { Tooltip } from "antd";

const shopPricesPage = () => {
  const router = useRouter();
  const { region } = router.query;
  const [expandedShops, setExpandedShops] = useState([
    shops[region] ? Object.keys(shops[region])[0] : "",
  ]);
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

        width: "100vw",
      }}
    >
      <h4 className="">Shop Prices | {region}</h4>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.25rem",
            flexDirection: "column",
          }}
        >
          {" "}
          <Button
            key={"back"}
            label={"Back"}
            trigger={() => {
              router.push("/shop-prices");
            }}
          />
          {region &&
            Object.keys(shops[region]).map(regShop => {
              return (
                <Button
                  key={regShop}
                  label={regShop}
                  trigger={() => {
                    setExpandedShops([regShop]);
                  }}
                />
              );
            })}
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {region &&
            shops &&
            Object.entries(shops[region])
              .filter(([shop]) => expandedShops.includes(shop))
              .map(([shop, items]) => {
                return (
                  <div key={shop}>
                    <h3
                      style={{
                        marginBottom: "1rem",
                      }}
                    >
                      {shop}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        width: "40rem",
                        maxWidth: "100%",
                      }}
                    >
                      {items.map(item => {
                        return (
                          <div
                            key={item.name}
                            style={{
                              display: "flex",
                              gap: "0.25rem",
                              alignItems: "center",
                              backgroundColor: "#0B0B0B",
                              border: "#323131 solid 3px",
                              borderRadius: "0.5rem",
                              height: "7rem",
                              width: "7rem",
                              justifyContent: "center",
                              position: "relative",
                              color: "white",
                            }}
                          >
                            <img
                              src={`/icons/${item.icon}.png`}
                              alt={item.name}
                              style={{ width: "70%", height: "70%" }}
                            />
                            <p
                              style={{
                                position: "absolute",
                                bottom: "0.1rem",
                                left: "0.1rem",
                                margin: "auto",
                              }}
                            >
                              x{item.maxStock}
                            </p>
                            <p
                              style={{
                                position: "absolute",
                                top: "0.1rem",
                                right: "0.1rem",
                                margin: "auto",
                                color: "#4F9B23",
                              }}
                            >
                              B {formatPrice(item.price)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default shopPricesPage;
