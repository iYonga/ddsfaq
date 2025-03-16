import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/GameMap.module.css";
import { Popover, Button } from "antd";

import maplibregl from "maplibre-gl";

// Dynamically import Map and Marker from the MapLibre version of react-map-gl for SSR safety.
const Map = dynamic(
  () => import("react-map-gl/maplibre").then(mod => mod.default),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-map-gl/maplibre").then(mod => mod.Marker),
  { ssr: false },
);

// Helper: Convert image (0 to 4096) coordinates to geographic coordinates.
const convertCoordinates = (x, y, imageWidth = 4096, imageHeight = 4096) => {
  const longitude = (x / imageWidth) * 360 - 180;
  const latitude = 85 - (y / imageHeight) * 170;
  return { longitude, latitude };
};

const GameMap = () => {
  const [markers, setMarkers] = useState([]);
  const [coords, setCoords] = useState({ lng: 0, lat: 0 });

  useEffect(() => {
    // Define markers in image coordinate space.
    const imageMarkers = [
      {
        id: 1,
        x: 3717,
        y: 1814,
        icon: "/icons/Marker_Hideout.png",
        title: "Bunker",
      },
      {
        id: 2,
        x: 1500,
        y: 1200,
        icon: "/icons/Marker_Town.png",
        title: "Town",
      },
      // You can add more markers here...
    ];
    // Convert image coordinates to geographic coordinates.
    const geoMarkers = imageMarkers.map(marker => {
      const { longitude, latitude } = convertCoordinates(marker.x, marker.y);
      return { ...marker, longitude, latitude };
    });
    setMarkers(geoMarkers);
  }, []);

  const handleMarkerClick = useCallback(marker => {
    console.log("Marker clicked:", marker);
  }, []);

  // Popup content using Ant Design.
  const getPopupContent = marker => (
    <div>
      <h3>{marker.title}</h3>
      <p>Placeholder action for {marker.title}.</p>
      <Button
        type="primary"
        onClick={() => alert(`Action for ${marker.title}`)}
      >
        Action
      </Button>
    </div>
  );

  return (
    <div className={styles.mapContainer}>
      <Map
        initialViewState={{
          longitude: 0, // Centered at 0,0 (this is the center of our coordinate system)
          latitude: 0,
          zoom: 1.5,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={{
          version: 8,
          sources: {
            "game-map": {
              type: "image",
              url: "/icons/DDS2_MapIslaSombra_4k.png",
              coordinates: [
                [-180, 85], // Top-left
                [180, 85], // Top-right
                [180, -85], // Bottom-right
                [-180, -85], // Bottom-left
              ],
            },
          },
          layers: [
            {
              id: "game-map-layer",
              type: "raster",
              source: "game-map",
            },
          ],
        }}
        // Disable world copies so the map doesn't loop.
        renderWorldCopies={false}
        // Update coordinates on mouse movement.
        onMouseMove={e => {
          setCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat });
        }}
        mapLib={maplibregl}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <Popover
              content={getPopupContent(marker)}
              title={marker.title}
              trigger="hover"
            >
              <div
                onClick={() => handleMarkerClick(marker)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={marker.icon}
                  alt={marker.title}
                  width="32"
                  height="32"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              </div>
            </Popover>
          </Marker>
        ))}
      </Map>
      {/* Coordinates overlay */}
      <div className={styles.coordsDisplay}>
        Coordinates: {coords.lng.toFixed(4)}, {coords.lat.toFixed(4)}
      </div>
    </div>
  );
};

export default GameMap;
