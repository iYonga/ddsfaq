import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import { formatPrice } from "@/utils/numerology";
import Button from "@/components/pickles/Button";
import { Popover, Dropdown } from "antd";
import { Menu } from "antd";

const ShopPricesPage = () => {
  const router = useRouter();
  const { region } = router.query;

  // expandedShops, aktif olarak açılmış/expand edilmiş dükkanları tutuyor
  const [expandedShops, setExpandedShops] = useState([]);
  const [chosenLevel, setChosenLevel] = useState(0);

  // region değiştiğinde, expandedShops'ı ilk dükkan ile başlat
  useEffect(() => {
    if (region && shops[region]) {
      // Örneğin ilk dükkanı otomatik olarak aç
      const firstShop = Object.keys(shops[region])[0];
      setExpandedShops([firstShop]);
    }
  }, [region]);
  useEffect(() => {
    setChosenLevel(0);
  }, [expandedShops]);

  const handleExpandShop = shopName => {
    // Tek bir dükkan açılsın istiyorsan direkt set, birden çok açılacaksa push
    setExpandedShops([shopName]);
  };

  if (!region || !shops[region]) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>Region not found or no data!</h2>
        <Button label="Back" trigger={() => router.push("/shop-prices")} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
        width: "100%",
      }}
    >
      <h4>Shop Prices | {region}</h4>

      {/* Sol taraftaki butonlar */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Buton kolonumuz */}
        <div
          style={{ display: "flex", gap: "0.25rem", flexDirection: "column" }}
        >
          <Button
            key={"back"}
            label={"Back"}
            trigger={() => router.push("/shop-prices")}
          />

          {Object.keys(shops[region]).map(shopName => (
            <Button
              key={shopName}
              label={shopName}
              trigger={() => handleExpandShop(shopName)}
            />
          ))}
        </div>

        {/* Açık olan shop'ların içeriği */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
            maxWidth: "75vw",
          }}
        >
          {Object.entries(shops[region]).map(([shopName, shopObj]) => {
            // Dükkan expandedShops'ta yoksa hiç renderlama
            if (!expandedShops.includes(shopName)) return null;

            return (
              <div
                key={shopName}
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
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <span>{shopName}</span>
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
                          pay with your bank account.
                        </>
                      )}
                      Restocks{" "}
                      {shopObj.data.ShopRestockInterval == 1
                        ? "daily"
                        : `every ${shopObj.data.ShopRestockInterval} days`}
                    </span>
                  </span>
                  <span>
                    {shopObj.data.PriceDiscountPerLevel &&
                      shopObj.data.PriceDiscountPerLevel.length > 0 && (
                        <Dropdown
                          overlay={
                            <Menu
                              style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                backgroundColor: "#0B0B0B",
                                color: "white",
                              }}
                            >
                              {shopObj.data.PriceDiscountPerLevel.map(
                                (discount, index) => (
                                  <Menu.Item
                                    key={index}
                                    onClick={() => {
                                      setChosenLevel(index);
                                    }}
                                    style={{
                                      color: "white",
                                    }}
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
                              onClick={e => e.preventDefault()}
                            ></Button>
                          </span>
                        </Dropdown>
                      )}
                  </span>
                </h3>

                {/* Ürünlerin listesi */}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {shopObj.items.map(item => {
                    // item.icon var mı bak, yoksa fallback
                    const iconFilename = item.icon || "placeholderIcon";

                    return (
                      <Popover
                        key={`${shopName}-${item.name}`}
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
                              <b>Max Stock:</b> {item.maxStock}
                            </span>
                            <span>
                              <b>Max Stock Price:</b> {item.maxStockPrice}
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
                          {/* İkon */}
                          <img
                            src={`/icons/${iconFilename}.png`}
                            alt={item.name}
                            style={{ maxWidth: "70%", maxHeight: "70%" }}
                          />

                          {/* Max stock */}
                          <p
                            style={{
                              position: "absolute",
                              bottom: "0.1rem",
                              left: "0.1rem",
                              margin: 0,
                            }}
                          >
                            x
                            {chosenLevel == 0
                              ? item.ItemDefaultStock
                              : item.ItemMaxStockPerLevel[chosenLevel]}
                          </p>

                          {/* Fiyat */}
                          <p
                            style={{
                              position: "absolute",
                              top: "0.1rem",
                              right: "0.1rem",
                              margin: 0,
                              color: "#4F9B23",
                            }}
                          >
                            B {formatPrice(item.price)}
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

export default ShopPricesPage;
