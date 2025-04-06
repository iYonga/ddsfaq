import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import { formatPrice } from "@/utils/numerology";
import Button from "@/components/pickles/Button";
import { Popover, Dropdown, Menu } from "antd";
import Input from "@/components/pickles/Input";
import Head from "next/head";

const regionBlacklist = [
  "Unknown",
  "None",
  "Bahía de Oro - Villa disctrict",
  "Rabin's Jungle",
  "Swamp",
];

const Search = () => {
  const router = useRouter();
  const [expandedShops, setExpandedShops] = useState([]);
  const [chosenLevels, setChosenLevels] = useState({});
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input to reduce re-renders
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (shops) {
      const allShopObjects = Object.keys(shops)
        .filter(region => !regionBlacklist.includes(region))
        .flatMap(region => Object.values(shops[region]));
      setExpandedShops(allShopObjects);
    }
  }, []);

  const handleLevelChange = (shopId, level) => {
    setChosenLevels(prev => ({
      ...prev,
      [shopId]: level,
    }));
  };

  const filteredShops = useMemo(() => {
    if (!debouncedSearch) return [];
    const lowerSearch = debouncedSearch.toLowerCase();
    return expandedShops
      .map(shop => ({
        ...shop,
        items: shop.items.filter(item =>
          item.name.toLowerCase().includes(lowerSearch),
        ),
      }))
      .filter(shop => shop.items.length > 0);
  }, [debouncedSearch, expandedShops]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Head>
        <title>Search Shops | DDS2FAQ</title>
      </Head>
      <h3>Drug Dealer Simulator 2 | Interactive FAQ</h3>
      <h4>Search Items</h4>
      <Input
        placeholder="Search"
        value={search}
        setValue={setSearch}
        style={{ width: "40%" }}
      />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          style={{ display: "flex", gap: "0.25rem", flexDirection: "column" }}
        >
          <Button
            key="back"
            label="Back"
            trigger={() => router.push("/shop-prices")}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "75vw",
          }}
        >
          {filteredShops.map(shopObj => {
            const shopId = shopObj.data.name + shopObj.data.region;
            const chosenLevel = chosenLevels[shopId] || 0;

            return (
              <div
                key={shopId}
                style={{
                  border: "1px solid #333",
                  padding: "1rem",
                  minWidth: "50vw",
                }}
              >
                <h3
                  style={{
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    height: "3rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <span>
                      {" "}
                      {shopObj.data.region} - {shopObj.data.name}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                      }}
                    >
                      {shopObj.data.ShopCanPayCheck ? (
                        <>
                          You{" "}
                          <span
                            style={{
                              color: "green",
                            }}
                          >
                            CAN
                          </span>{" "}
                          pay with your bank account,{" "}
                        </>
                      ) : (
                        <>
                          You{" "}
                          <span
                            style={{
                              color: "red",
                            }}
                          >
                            CAN'T
                          </span>{" "}
                          pay with your bank account,{" "}
                        </>
                      )}
                      Restocks{" "}
                      {shopObj.data.ShopRestockInterval == 1
                        ? "daily"
                        : `every ${shopObj.data.ShopRestockInterval} days`}
                    </span>
                  </span>

                  <span>
                    {shopObj.data.PriceDiscountPerLevel?.length > 0 && (
                      <Dropdown
                        trigger={["click"]}
                        overlay={
                          <Menu
                            style={{
                              overflowY: "auto",
                              backgroundColor: "#0B0B0B",
                              color: "white",
                            }}
                          >
                            {shopObj.data.PriceDiscountPerLevel.map(
                              (_, index) => (
                                <Menu.Item
                                  key={index}
                                  onClick={() =>
                                    handleLevelChange(shopId, index)
                                  }
                                  style={{ color: "white" }}
                                >
                                  Level {index}
                                </Menu.Item>
                              ),
                            )}
                          </Menu>
                        }
                      >
                        <span>
                          <Button
                            label={`Level: ${chosenLevel}`}
                            style={{ height: "2.5rem" }}
                          />
                        </span>
                      </Dropdown>
                    )}
                  </span>
                </h3>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {shopObj.items.map(item => {
                    const stock =
                      chosenLevel === 0
                        ? item.ItemMaxStockPerLevel[0]
                        : item.ItemMaxStockPerLevel[chosenLevel];

                    const discount =
                      chosenLevel > 0 &&
                      shopObj.data.PriceDiscountPerLevel?.length > chosenLevel
                        ? shopObj.data.PriceDiscountPerLevel[chosenLevel]
                        : 0;

                    const finalPrice = formatPrice(
                      stock * (item.price * (1 - discount)),
                    );

                    return (
                      <Popover
                        key={`${shopId}-${item.name}`}
                        color="#0B0B0B"
                        content={
                          <div
                            style={{
                              display: "flex",
                              gap: "0.25rem",
                              alignItems: "center",
                              backgroundColor: "#0B0B0B",
                              border: "#323131 solid 3px",
                              borderRadius: "0.5rem",
                              height: "15rem",
                              width: "15rem",
                              justifyContent: "center",
                              color: "white",
                              textAlign: "center",
                              flexDirection: "column",
                              padding: "1rem",
                            }}
                          >
                            <h2>{item.name}</h2>
                            <span>
                              <b>Stack Price:</b> B {finalPrice}
                            </span>
                          </div>
                        }
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
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
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={`/icons/${item.icon || "placeholderIcon"}.png`}
                            alt={item.name}
                            style={{ maxWidth: "70%", maxHeight: "70%" }}
                          />
                          <p
                            style={{
                              position: "absolute",
                              bottom: "0.1rem",
                              left: "0.1rem",
                            }}
                          >
                            x{stock}
                          </p>
                          <p
                            style={{
                              position: "absolute",
                              top: "0.1rem",
                              right: "0.1rem",
                              margin: 0,
                              color: "#4F9B23",
                            }}
                          >
                            B {formatPrice(item.price * (1 - discount))}
                          </p>
                        </div>
                      </Popover>
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

export default Search;
