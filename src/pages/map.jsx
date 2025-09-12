import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import mapObj from "@/resources/map.json";
import styles from "@/styles/GameMap.module.css";
import Button from "@/components/pickles/Button";
import { normalizedToPixel, parseElevation } from "@/utils/mapUtils";
import {
  processMapData,
  filterLocationsByCategory,
  filterLocationsByTag,
  getDataBounds,
} from "@/utils/mapDataProcessor";
import { useCoordinateConfig } from "@/components/CoordinateConfig";

const MapComponent = () => {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapDimensions, setMapDimensions] = useState({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    containerWidth: 0,
    containerHeight: 0,
  });
  const [showDataPoints, setShowDataPoints] = useState(true);
  const [filterCategory, setFilterCategory] = useState([]); // Categories to show
  const [filterTag, setFilterTag] = useState([]); // Specific tags to show
  const [showDebugWindow, setShowDebugWindow] = useState(true); // Debug window toggle
  const mapRef = useRef(null);
  const imageRef = useRef(null);

  // Initialize coordinate configuration
  const dataBounds = getDataBounds();
  const {
    config,
    worldBounds,
    mapBounds,
    updateConfig,
    adjustments,
    applyPreset,
    configData,
  } = useCoordinateConfig(dataBounds);

  // Process map data on component mount
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setIsLoading(true); // Pass the coordinate configuration data to the processor
        const { convertWorldToNormalized } = await import(
          "@/components/CoordinateConfig"
        );
        const processedData = await processMapData(
          configData,
          convertWorldToNormalized,
        );
        setMapData(processedData);

        // Debug: log first few locations to see their normalized coordinates
        if (processedData.locations.length > 0) {
          console.log(
            "Sample locations with coordinates:",
            processedData.locations.slice(0, 5).map(loc => ({
              name: loc.name,
              world: loc.coordinates.world,
              normalized: loc.coordinates.normalized,
              markerInfo: loc.markerInfo,
            })),
          );

          // Check for any coordinates outside 0-1 range
          const invalidCoords = processedData.locations.filter(
            loc =>
              loc.coordinates.normalized.x < 0 ||
              loc.coordinates.normalized.x > 1 ||
              loc.coordinates.normalized.y < 0 ||
              loc.coordinates.normalized.y > 1,
          );

          if (invalidCoords.length > 0) {
            console.warn(
              "Found locations with coordinates outside 0-1 range:",
              invalidCoords.length,
            );
            console.log("Examples:", invalidCoords.slice(0, 3));
          }

          // Console helper message for fine-tuning
          console.log("=== COORDINATE PRECISION TUNING ===");
          console.log("Use the debug window buttons or console commands:");
          console.log("• coordConfig.adjust.moveLeft() - Shift markers left");
          console.log("• coordConfig.adjust.moveRight() - Shift markers right");
          console.log("• coordConfig.adjust.moveUp() - Shift markers up");
          console.log("• coordConfig.adjust.moveDown() - Shift markers down");
          console.log("• coordConfig.adjust.tighter() - Tighter bounds");
          console.log("• coordConfig.adjust.looser() - Looser bounds");
          console.log("• coordConfig.adjust.reset() - Reset to defaults");
          console.log("• coordConfig.presets('tight') - Apply tight preset");
          console.log("Changes are applied in real-time!");
        }
      } catch (error) {
        console.error("Error loading map data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only load map data when we have coordinate configuration
    if (configData) {
      loadMapData();
    }
  }, [configData]); // Reload when config changes
  // Update map dimensions when image loads
  useEffect(() => {
    const updateDimensions = () => {
      if (imageRef.current) {
        const img = imageRef.current;
        const rect = img.getBoundingClientRect();

        // Calculate the actual displayed image dimensions considering object-fit: contain
        const imageAspectRatio = img.naturalWidth / img.naturalHeight;
        const containerAspectRatio = rect.width / rect.height;

        let actualWidth,
          actualHeight,
          offsetX = 0,
          offsetY = 0;

        if (imageAspectRatio > containerAspectRatio) {
          // Image is wider - letterboxed top/bottom
          actualWidth = rect.width;
          actualHeight = rect.width / imageAspectRatio;
          offsetY = (rect.height - actualHeight) / 2;
        } else {
          // Image is taller - letterboxed left/right
          actualHeight = rect.height;
          actualWidth = rect.height * imageAspectRatio;
          offsetX = (rect.width - actualWidth) / 2;
        }
        setMapDimensions({
          width: actualWidth,
          height: actualHeight,
          offsetX,
          offsetY,
          containerWidth: rect.width,
          containerHeight: rect.height,
        });

        // Debug logging for positioning verification
        console.log("Map dimensions updated:", {
          actualPngSize: { width: actualWidth, height: actualHeight },
          letterboxOffset: { x: offsetX, y: offsetY },
          containerSize: { width: rect.width, height: rect.height },
          imageNaturalSize: {
            width: img.naturalWidth,
            height: img.naturalHeight,
          },
          aspectRatios: {
            image: imageAspectRatio.toFixed(3),
            container: containerAspectRatio.toFixed(3),
          },
        });
      }
    };

    const img = imageRef.current;
    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        updateDimensions();
      } else {
        img.addEventListener("load", updateDimensions);
        return () => img.removeEventListener("load", updateDimensions);
      }
    }

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  // Get all locations to display based on filter
  const getFilteredLocations = () => {
    if (!mapData) return [];

    let locations = mapData.locations;

    // Filter by categories if specified
    if (filterCategory.length > 0) {
      locations = filterLocationsByCategory(locations, filterCategory);
    }

    // Filter by tags if specified
    if (filterTag.length > 0) {
      locations = filterLocationsByTag(locations, filterTag);
    }

    return locations;
  }; // Convert normalized coordinates (0-1) to pixel coordinates
  const getPixelPosition = (normalizedX, normalizedY) => {
    // Calculate position within the actual displayed PNG area
    const x = normalizedX * mapDimensions.width;
    const y = normalizedY * mapDimensions.height;

    // Add letterboxing offset to position relative to container
    const result = {
      x: x + (mapDimensions.offsetX || 0),
      y: y + (mapDimensions.offsetY || 0),
    }; // Debug logging for test markers at center (0.5, 0.5)
    if (
      Math.abs(normalizedX - 0.5) < 0.001 &&
      Math.abs(normalizedY - 0.5) < 0.001
    ) {
      console.log("Center marker positioned at:", {
        normalized: { x: normalizedX, y: normalizedY },
        withinPng: { x, y },
        finalPosition: result,
        mapDimensions,
        shouldBeAtCenter: {
          expectedPngX: mapDimensions.width / 2,
          expectedPngY: mapDimensions.height / 2,
          actualPngX: x,
          actualPngY: y,
        },
      });
    }

    return result;
  };
  // Handle clicking on the map to add new markers (for development)
  const handleMapClick = event => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      // Account for letterboxing offsets
      const clickX = event.clientX - rect.left - (mapDimensions.offsetX || 0);
      const clickY = event.clientY - rect.top - (mapDimensions.offsetY || 0);

      const x = clickX / mapDimensions.width;
      const y = clickY / mapDimensions.height;

      // Only log if click is within the actual image bounds
      if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
        console.log(
          `Clicked at normalized coordinates: x=${x.toFixed(3)}, y=${y.toFixed(
            3,
          )}`,
        );

        // Optionally add temporary marker
        console.log("Copy this to add a new location:");
        console.log(
          `{ id: ${Date.now()}, x: ${x.toFixed(3)}, y: ${y.toFixed(
            3,
          )}, name: "New Location", type: "custom" },`,
        );
      }
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Head>
        <title>Interactive Map | DDSFAQ</title>
        <meta
          name="description"
          content="Interactive map for Drug Dealer Simulator 2. Explore all locations, points of interest, and navigate the game world easily."
        />

        {/* OpenGraph Meta Tags */}
        <meta
          property="og:title"
          content="Interactive Map | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          property="og:description"
          content="Interactive map for Drug Dealer Simulator 2. Explore all locations, points of interest, and navigate the game world easily."
        />
        <meta property="og:url" content="https://dds.yonga.dev/map" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:title"
          content="Interactive Map | Drug Dealer Simulator 2 FAQ"
        />
        <meta
          name="twitter:description"
          content="Interactive map for Drug Dealer Simulator 2. Explore all locations, points of interest, and navigate the game world easily."
        />

        <link rel="canonical" href="https://dds.yonga.dev/map" />
      </Head>
      {/* Header Controls */}
      <div
        style={{
          backgroundColor: "#222",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        <h2 style={{ margin: 0 }}>Drug Dealer Simulator 2 - Interactive Map</h2>{" "}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button label="Back" trigger={() => router.push("/")} />

          {/* Category Filter */}
          {mapData && (
            <select
              multiple
              value={filterCategory}
              onChange={e =>
                setFilterCategory(
                  Array.from(e.target.selectedOptions, option => option.value),
                )
              }
              style={{
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                backgroundColor: "#111",
                color: "white",
                minWidth: "120px",
              }}
            >
              <option value="">All Categories</option>
              {Object.entries(mapData.categories).map(([category, info]) => (
                <option key={category} value={category}>
                  {info.label} ({info.count})
                </option>
              ))}
            </select>
          )}

          {/* Statistics */}
          {mapData && (
            <span style={{ fontSize: "14px", opacity: 0.8 }}>
              {getFilteredLocations().length} / {mapData.locations.length}{" "}
              locations
            </span>
          )}
        </div>
      </div>{" "}
      {/* Map Container */}
      <div className={styles.mapContainer} style={{ flex: 1 }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "20px",
              borderRadius: "8px",
              zIndex: 2000,
              textAlign: "center",
            }}
          >
            <div>Loading map data and marker icons...</div>
            <div style={{ marginTop: "10px", fontSize: "12px", opacity: 0.8 }}>
              Loading official marker database from game files
            </div>
          </div>
        )}
        {/* Map Image */}
        <img
          ref={imageRef}
          src="/images/map.png"
          alt="Game Map"
          className={styles.mapImage}
          onClick={handleMapClick}
          draggable={false}
        />{" "}
        {/* Location Markers */}{" "}
        {mapDimensions.width > 0 &&
          getFilteredLocations()
            .filter(location => {
              // Only render markers with valid normalized coordinates within bounds
              const coords = location.coordinates.normalized;
              const isValid =
                coords.x >= 0.02 &&
                coords.x <= 0.98 &&
                coords.y >= 0.02 &&
                coords.y <= 0.98;

              if (!isValid) {
                console.log(
                  `Filtering out ${
                    location.name
                  } with coords (${coords.x.toFixed(3)}, ${coords.y.toFixed(
                    3,
                  )})`,
                );
              }

              return isValid;
            })
            .map(location => {
              const pixelPos = getPixelPosition(
                location.coordinates.normalized.x,
                location.coordinates.normalized.y,
              );

              return (
                <div
                  key={location.id}
                  className={styles.marker}
                  style={{
                    left: `${pixelPos.x}px`,
                    top: `${pixelPos.y}px`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    zIndex: 1000,
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedLocation(location);
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform =
                      "translate(-50%, -50%) scale(1.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform =
                      "translate(-50%, -50%) scale(1)";
                  }}
                  title={`${location.name} (${location.tag})`}
                >
                  {/* Render actual game icon */}
                  {location.markerInfo?.iconPath ? (
                    <img
                      src={location.markerInfo.iconPath}
                      alt={location.name}
                      style={{
                        width: "16px",
                        height: "16px",
                        display: "block",
                      }}
                      onError={e => {
                        // Fallback to colored dot if icon fails to load
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "block";
                      }}
                    />
                  ) : null}
                  {/* Fallback colored dot */}
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: location.markerInfo?.color || "#888888",
                      display: location.markerInfo?.iconPath ? "none" : "block",
                      border: "1px solid white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  />
                </div>
              );
            })}
        {/* Location Info Panel */}
        {selectedLocation && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              maxWidth: "300px",
              zIndex: 2000,
              border: "1px solid #444",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              onClick={() => setSelectedLocation(null)}
            >
              ×
            </button>{" "}
            <h3 style={{ margin: "0 0 8px 0", color: "#ffcc00" }}>
              {selectedLocation.name}
            </h3>
            <p style={{ margin: "0 0 8px 0", textTransform: "capitalize" }}>
              <strong>Category:</strong>{" "}
              {mapData?.categories[selectedLocation.category]?.label ||
                selectedLocation.category}
              {selectedLocation.markerInfo?.icon && (
                <span
                  style={{
                    marginLeft: "8px",
                    padding: "2px 6px",
                    backgroundColor: selectedLocation.markerInfo.color,
                    borderRadius: "3px",
                    fontSize: "10px",
                    color: "white",
                  }}
                >
                  📍
                </span>
              )}
            </p>
            <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#ccc" }}>
              <strong>Tag:</strong> {selectedLocation.tag}
            </p>
            {selectedLocation.description && (
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                {selectedLocation.description}
              </p>
            )}
            <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "12px" }}>
              <p style={{ margin: "0 0 4px 0" }}>
                <strong>World Coordinates:</strong>
                <br />
                X: {selectedLocation.coordinates.world.x.toFixed(1)}, Y:{" "}
                {selectedLocation.coordinates.world.y.toFixed(1)}, Z:{" "}
                {selectedLocation.coordinates.world.z.toFixed(1)}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Map Position:</strong>
                {selectedLocation.coordinates.normalized.x.toFixed(3)},
                {selectedLocation.coordinates.normalized.y.toFixed(3)}
              </p>
            </div>
          </div>
        )}{" "}
        {/* Map Data Info */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "12px",
            zIndex: 1000,
            border: "1px solid #444",
          }}
        >
          {mapData && (
            <>
              <div>
                <strong>Total Locations:</strong> {mapData.locations.length}
              </div>
              <div>
                <strong>Showing:</strong> {getFilteredLocations().length}{" "}
                locations
              </div>
              <div>
                <strong>Categories:</strong>{" "}
                {Object.keys(mapData.categories).length}
              </div>{" "}
              <div>
                <strong>Map Size:</strong>{" "}
                {mapDimensions.width?.toFixed(0) || 0}×
                {mapDimensions.height?.toFixed(0) || 0}px
                {mapDimensions.offsetX > 0 || mapDimensions.offsetY > 0
                  ? ` (offset: ${mapDimensions.offsetX?.toFixed(0) || 0}, ${
                      mapDimensions.offsetY?.toFixed(0) || 0
                    })`
                  : ""}
              </div>
              <div style={{ marginTop: "8px", opacity: 0.8 }}>
                💡 Click on map to get coordinates for adding new locations
              </div>
            </>
          )}
        </div>
        {/* Legend */}
        {mapData && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "12px",
              borderRadius: "6px",
              fontSize: "12px",
              zIndex: 1000,
              border: "1px solid #444",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Legend
            </div>
            {Object.entries(mapData.categories).map(([category, info]) => (
              <div
                key={category}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                {" "}
                <div
                  style={{
                    width: "16px",
                    height: "12px",
                    backgroundColor: info.color,
                    borderRadius: "2px",
                    border: "1px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8px",
                  }}
                >
                  {info.icon ? "📍" : ""}
                </div>{" "}
                <span>
                  {info.label} ({info.count})
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Debug Window */}
        {showDebugWindow && mapData && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "20px",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              maxWidth: "400px",
              maxHeight: "80vh",
              overflow: "auto",
              zIndex: 3000,
              border: "1px solid #444",
              fontSize: "11px",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, color: "#ffcc00" }}>Debug Info</h3>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #666",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: "2px 6px",
                  borderRadius: "3px",
                }}
                onClick={() => setShowDebugWindow(false)}
              >
                Hide
              </button>
            </div>
            {/* Coordinate Bounds */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Coordinate Bounds:
              </h4>
              <div>Total locations: {mapData.locations.length}</div>
              {(() => {
                // Calculate bounds from actual data
                let minX = Infinity,
                  maxX = -Infinity,
                  minY = Infinity,
                  maxY = -Infinity;
                mapData.locations.forEach(loc => {
                  if (loc.coordinates.world) {
                    minX = Math.min(minX, loc.coordinates.world.x);
                    maxX = Math.max(maxX, loc.coordinates.world.x);
                    minY = Math.min(minY, loc.coordinates.world.y);
                    maxY = Math.max(maxY, loc.coordinates.world.y);
                  }
                });
                const worldWidth = maxX - minX;
                const worldHeight = maxY - minY;
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                return (
                  <>
                    <div>
                      X: {minX.toFixed(1)} to {maxX.toFixed(1)} (range:{" "}
                      {worldWidth.toFixed(1)})
                    </div>
                    <div>
                      Y: {minY.toFixed(1)} to {maxY.toFixed(1)} (range:{" "}
                      {worldHeight.toFixed(1)})
                    </div>
                    <div>
                      Center: ({centerX.toFixed(1)}, {centerY.toFixed(1)})
                    </div>
                  </>
                );
              })()}
            </div>
            {/* Map Dimensions */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Map Display:
              </h4>
              <div>
                PNG Size: {mapDimensions.width.toFixed(0)}×
                {mapDimensions.height.toFixed(0)}
              </div>
              <div>
                Offset: ({mapDimensions.offsetX.toFixed(0)},{" "}
                {mapDimensions.offsetY.toFixed(0)})
              </div>
              <div>
                Container: {mapDimensions.containerWidth.toFixed(0)}×
                {mapDimensions.containerHeight.toFixed(0)}
              </div>
            </div>
            {/* Sample Locations */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Sample Locations (first 8):
              </h4>
              {mapData.locations.slice(0, 8).map((loc, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "6px",
                    padding: "4px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <div style={{ fontWeight: "bold", color: "#ffcc00" }}>
                    {loc.tag}
                  </div>
                  <div>
                    World: ({loc.coordinates.world.x.toFixed(1)},{" "}
                    {loc.coordinates.world.y.toFixed(1)})
                  </div>
                  <div>
                    Normalized: ({loc.coordinates.normalized.x.toFixed(3)},{" "}
                    {loc.coordinates.normalized.y.toFixed(3)})
                  </div>
                  {(() => {
                    const pixelPos = getPixelPosition(
                      loc.coordinates.normalized.x,
                      loc.coordinates.normalized.y,
                    );
                    return (
                      <div>
                        Pixel: ({pixelPos.x.toFixed(0)}, {pixelPos.y.toFixed(0)}
                        )
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
            {/* Test Markers Info */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Test Markers:
              </h4>
              {mapData.locations
                .filter(loc => loc.tag.includes("TEST"))
                .map((loc, i) => (
                  <div
                    key={i}
                    style={{
                      marginBottom: "4px",
                      padding: "4px",
                      backgroundColor: "rgba(255,0,0,0.2)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: loc.markerInfo.color,
                      }}
                    >
                      {loc.name}
                    </div>
                    <div>
                      World: ({loc.coordinates.world.x.toFixed(1)},{" "}
                      {loc.coordinates.world.y.toFixed(1)})
                    </div>
                    <div>
                      Normalized: ({loc.coordinates.normalized.x.toFixed(3)},{" "}
                      {loc.coordinates.normalized.y.toFixed(3)})
                    </div>
                    {(() => {
                      const pixelPos = getPixelPosition(
                        loc.coordinates.normalized.x,
                        loc.coordinates.normalized.y,
                      );
                      return (
                        <div>
                          Pixel: ({pixelPos.x.toFixed(0)},{" "}
                          {pixelPos.y.toFixed(0)})
                        </div>
                      );
                    })()}
                  </div>
                ))}
            </div>{" "}
            {/* Coordinate Conversion Formula */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Current Formula:
              </h4>
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: "8px",
                }}
              >
                <div>normalizedX = (worldX - mapMinX) / mapWidth</div>
                <div>normalizedY = (worldY - mapMinY) / mapHeight</div>
                <div style={{ marginTop: "4px", color: "#ffaa00" }}>
                  Map bounds with 10% padding around actual data bounds
                </div>
                <div style={{ marginTop: "4px", fontSize: "10px" }}>
                  This assumes the PNG represents the data bounds + padding, not
                  the entire world
                </div>
              </div>
            </div>
            {/* Precision Tuning Controls */}
            <div style={{ marginBottom: "12px" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#88ff88" }}>
                Precision Tuning:
              </h4>
              <div style={{ marginBottom: "8px" }}>
                <div
                  style={{
                    color: "#aaa",
                    fontSize: "10px",
                    marginBottom: "4px",
                  }}
                >
                  Current Config:{" "}
                  {JSON.stringify(getCoordinateConfig().config, null, 2)}
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                {" "}
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#444",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.moveLeft()}
                >
                  ← Left
                </button>
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#444",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.moveRight()}
                >
                  Right →
                </button>
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#444",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.moveUp()}
                >
                  ↑ Up
                </button>
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#444",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.moveDown()}
                >
                  ↓ Down
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "4px",
                  marginBottom: "8px",
                }}
              >
                {" "}
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#662200",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.tighter()}
                >
                  Tighter
                </button>
                <button
                  style={{
                    padding: "4px 6px",
                    backgroundColor: "#220066",
                    border: "1px solid #666",
                    color: "white",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => adjustments.looser()}
                >
                  Looser
                </button>
              </div>
              <button
                style={{
                  width: "100%",
                  padding: "4px 6px",
                  backgroundColor: "#006600",
                  border: "1px solid #666",
                  color: "white",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                  marginBottom: "4px",
                }}
                onClick={() => adjustments.reset()}
              >
                Reset to Default
              </button>
            </div>
            {/* Copy Button */}
            <button
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#333",
                border: "1px solid #666",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => {
                const debugData = {
                  totalLocations: mapData.locations.length,
                  coordinateConfig: {
                    config,
                    bounds: mapBounds,
                    dataBounds: worldBounds,
                    configData,
                  },
                  bounds: (() => {
                    let minX = Infinity,
                      maxX = -Infinity,
                      minY = Infinity,
                      maxY = -Infinity;
                    mapData.locations.forEach(loc => {
                      if (loc.coordinates.world) {
                        minX = Math.min(minX, loc.coordinates.world.x);
                        maxX = Math.max(maxX, loc.coordinates.world.x);
                        minY = Math.min(minY, loc.coordinates.world.y);
                        maxY = Math.max(maxY, loc.coordinates.world.y);
                      }
                    });
                    return {
                      minX,
                      maxX,
                      minY,
                      maxY,
                      worldWidth: maxX - minX,
                      worldHeight: maxY - minY,
                      centerX: (minX + maxX) / 2,
                      centerY: (minY + maxY) / 2,
                    };
                  })(),
                  mapDimensions,
                  sampleLocations: mapData.locations.slice(0, 8).map(loc => ({
                    tag: loc.tag,
                    world: loc.coordinates.world,
                    normalized: loc.coordinates.normalized,
                    pixel: getPixelPosition(
                      loc.coordinates.normalized.x,
                      loc.coordinates.normalized.y,
                    ),
                  })),
                  testMarkers: mapData.locations
                    .filter(loc => loc.tag.includes("TEST"))
                    .map(loc => ({
                      name: loc.name,
                      world: loc.coordinates.world,
                      normalized: loc.coordinates.normalized,
                      pixel: getPixelPosition(
                        loc.coordinates.normalized.x,
                        loc.coordinates.normalized.y,
                      ),
                    })),
                };
                navigator.clipboard.writeText(
                  JSON.stringify(debugData, null, 2),
                );
                alert("Debug data copied to clipboard!");
              }}
            >
              Copy Debug Data to Clipboard
            </button>
          </div>
        )}
        {/* Toggle Debug Button */}
        {!showDebugWindow && (
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "350px",
              backgroundColor: "#333",
              border: "1px solid #666",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              zIndex: 2000,
            }}
            onClick={() => setShowDebugWindow(true)}
          >
            Show Debug
          </button>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
