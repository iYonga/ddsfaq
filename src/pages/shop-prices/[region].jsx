import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import shops from "@/resources/shops.json";
import { formatPrice } from "@/utils/numerology";
import Button from "@/components/pickles/Button";
import { Popover, Dropdown } from "antd";
import { Menu } from "antd";
import Input from "@/components/pickles/Input";
import Head from "next/head";

const ShopPricesPage = ({ region, regionData }) => {
  const router = useRouter();
  const [expandedShops, setExpandedShops] = useState([]);
  const [chosenLevel, setChosenLevel] = useState(0);
  const [search, setSearch] = useState("");
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);
  const paneRef = React.useRef(null);

  // region değiştiğinde, expandedShops'ı ilk dükkan ile başlat
  useEffect(() => {
    if (region && regionData) {
      // Örneğin ilk dükkanı otomatik olarak aç
      const firstShop = Object.keys(regionData)[0];
      setExpandedShops([firstShop]);
    }
  }, [region, regionData]);

  useEffect(() => {
    setChosenLevel(0);
  }, [expandedShops]);

  const handleExpandShop = shopName => {
    // Tek bir dükkan açılsın istiyorsan direkt set, birden çok açılacaksa push
    setExpandedShops([shopName]);
    setSearch("");
    setInitialHeight(paneRef.current.scrollHeight);
    setInitialWidth(paneRef.current.scrollWidth);
  };

  if (!region || !regionData) {
    return (
      <>
        <Head>
          <title>Region Not Found | DDSFAQ</title>
          <meta
            name="description"
            content="The requested region was not found. Please select a valid region from the shop prices list."
          />
        </Head>
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <h2>Region not found or no data!</h2>
          <Button label="Back" trigger={() => router.push("/shop-prices")} />
        </div>
      </>
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
        padding: "1rem",
      }}
    >
      <Head>
        <title>{region} Prices | DDSFAQ</title>
        <meta
          name="description"
          content={`Shop prices and items for ${region} in Drug Dealer Simulator 2. Interactive FAQ with detailed pricing information.`}
        />
        <meta
          name="keywords"
          content="Drug Dealer Simulator 2, DDS2, shop prices, game guide, FAQ, interactive"
        />
        <meta name="author" content="DDSFAQ" />

        {/* OpenGraph Meta Tags */}
        <meta
          property="og:title"
          content={`${region} Prices | Drug Dealer Simulator 2 FAQ`}
        />
        <meta
          property="og:description"
          content={`Browse shop prices and items for ${region} in Drug Dealer Simulator 2. Complete interactive FAQ guide.`}
        />
        <meta property="og:image" content="https://dds.yonga.dev/cover.png" />
        <meta property="og:image:width" content="3840" />
        <meta property="og:image:height" content="2160" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="DDSFAQ" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${region} Prices | Drug Dealer Simulator 2 FAQ`}
        />
        <meta
          name="twitter:description"
          content={`Browse shop prices and items for ${region} in Drug Dealer Simulator 2. Complete interactive FAQ guide.`}
        />
        <meta name="twitter:image" content="https://dds.yonga.dev/cover.png" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0B0B0B" />
        <link
          rel="canonical"
          href={`https://dds.yonga.dev/shop-prices/${region?.replaceAll(
            " ",
            "_",
          )}`}
        />
      </Head>
      <h3>Drug Dealer Simulator 2 | Interactive FAQ</h3>
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

          {Object.keys(regionData).map(shopName => (
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
            width: initialWidth === 0 ? "auto" : initialWidth,
            height: initialHeight === 0 ? "auto" : initialHeight,
          }}
          ref={paneRef}
        >
          {Object.entries(regionData).map(([shopName, shopObj]) => {
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
                          pay with your bank account,{" "}
                        </>
                      )}
                      Restocks{" "}
                      {shopObj.data.ShopRestockInterval == 1
                        ? "daily"
                        : `every ${shopObj.data.ShopRestockInterval} days`}
                    </span>
                  </span>
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <Input
                      placeholder="Search"
                      value={search}
                      setValue={setSearch}
                      style={{
                        width: "70%",
                      }}
                    />
                    {(shopObj.data.PriceDiscountPerLevel?.length > 1 ||
                      shopObj.items.some(
                        item => item.ItemMaxStockPerLevel?.length > 1,
                      )) && (
                      <Dropdown
                        overlay={
                          <Menu
                            style={{
                              overflowY: "auto",
                              backgroundColor: "#0B0B0B",
                              color: "white",
                            }}
                          >
                            {(() => {
                              // Level sayısını belirle: PriceDiscountPerLevel varsa onu kullan, yoksa ItemMaxStockPerLevel'dan al
                              const levelCount =
                                shopObj.data.PriceDiscountPerLevel?.length > 0
                                  ? shopObj.data.PriceDiscountPerLevel.length
                                  : Math.max(
                                      ...shopObj.items.map(
                                        item =>
                                          item.ItemMaxStockPerLevel?.length ||
                                          1,
                                      ),
                                    );

                              return Array.from(
                                { length: levelCount },
                                (_, index) => (
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
                              );
                            })()}
                          </Menu>
                        }
                      >
                        <span>
                          <Button
                            label={`Level: ${chosenLevel}`}
                            onClick={e => e.preventDefault()}
                            style={{
                              height: "2.5rem",
                              width: "7rem",
                            }}
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
                    // Eğer arama kutusuna bir şey yazıldıysa, item.name içinde ara
                    if (
                      search.length > 0 &&
                      !item.name.toLowerCase().includes(search.toLowerCase())
                    )
                      return null;

                    // item.icon var mı bak, yoksa fallback
                    const iconFilename = item.icon || "placeholderIcon";

                    const stock =
                      chosenLevel === 0
                        ? item.ItemMaxStockPerLevel?.[0] || 1
                        : item.ItemMaxStockPerLevel?.[chosenLevel] || 1;

                    const discount =
                      chosenLevel > 0 &&
                      shopObj.data.PriceDiscountPerLevel?.length > chosenLevel
                        ? shopObj.data.PriceDiscountPerLevel[chosenLevel] || 0
                        : 0;

                    const price = item.price || 0;
                    const finalPrice = formatPrice(
                      stock * (price * (1 - discount)),
                    );

                    return (
                      <Popover
                        key={`${shopName}-${item.name}`}
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
                          {/* İkon */}
                          <img
                            src={`/icons/${iconFilename}.png`}
                            alt={item.name}
                            style={{ maxWidth: "70%", maxHeight: "70%" }}
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = "/icons/question.png";
                            }}
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
                              ? item.ItemMaxStockPerLevel?.[0] || 1
                              : item.ItemMaxStockPerLevel?.[chosenLevel] || 1}
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
                            B{" "}
                            {formatPrice(
                              chosenLevel > 0 &&
                                shopObj.data.PriceDiscountPerLevel?.length >
                                  chosenLevel
                                ? (item.price || 0) -
                                    (item.price || 0) *
                                      (shopObj.data.PriceDiscountPerLevel[
                                        chosenLevel
                                      ] || 0)
                                : item.price || 0,
                            )}
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

// Static Site Generation için gerekli
export async function getStaticPaths() {
  // Tüm region'ları al
  const regionKeys = Object.keys(shops);

  const paths = regionKeys.map(region => ({
    params: {
      region: region.replaceAll(" ", "_"), // URL için underscore kullan
    },
  }));

  return {
    paths,
    fallback: false, // 404 göster eğer region bulunamazsa
  };
}

export async function getStaticProps({ params }) {
  const regionParam = params.region;
  const region = regionParam.replaceAll("_", " "); // Underscore'u space'e çevir

  // Region'ın shops'ta olup olmadığını kontrol et
  if (!shops[region]) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      region,
      regionData: shops[region],
    },
  };
}

export default ShopPricesPage;
