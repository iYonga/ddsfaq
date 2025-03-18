import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "../styles/GameMap.module.css";
import { Popover, Button, Slider, Switch, Select, Tooltip, Card, InputNumber, Row, Col } from "antd";
import map from "@/resources/map.json";
import maplibregl from "maplibre-gl";

// Dynamically import Map and Marker from the MapLibre version 1 react-map-gl for SSR safety.
const Map = dynamic(
  () => import("react-map-gl/maplibre").then(mod => mod.default),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-map-gl/maplibre").then(mod => mod.Marker),
  { ssr: false },
);

// Helper function: clamp values to a range
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Throttle function to limit how often a function can be called
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// GAME MAP CONFIGURATION
// ======================
const MAP_PRESETS = {
  auto: { 
    name: "Auto (Data-Based)", 
    description: "Automatically determine map size from data"
  },
  small: { 
    name: "Small World (50k)", 
    description: "50,000 x 50,000 world size", 
    worldSize: 50000 
  },
  medium: { 
    name: "Medium World (100k)", 
    description: "100,000 x 100,000 world size", 
    worldSize: 100000 
  },
  large: { 
    name: "Large World (150k)", 
    description: "150,000 x 150,000 world size", 
    worldSize: 150000 
  },
  xlarge: { 
    name: "Extra Large World (200k)", 
    description: "200,000 x 200,000 world size", 
    worldSize: 200000 
  }
};

const DEFAULT_CONFIG = {
  // Map behavior
  preset: "auto",             // Which world size preset to use ("auto", "small", "medium", "large", "xlarge")
  scaleMultiplier: 1.5,       // Scale multiplier applied to the map (adjust to make map larger or smaller)
  padding: 0.1,               // Padding around the map edges (0.1 = 10%)
  
  // Fine-tuning offsets
  offsetX: 35000,              // X offset for position fine-tuning (positive = right)
  offsetY: -32000,            // Y offset for position fine-tuning (positive = up)
  
  // Coordinate system
  reverseYAxis: true,         // Whether to reverse the Y-axis (often needed for game coordinates)
  centerAtZero: true,         // Center the world at (0,0) instead of using data center
  
  // UI behavior
  initialZoom: 1.8,           // Initial zoom level
  markerSize: 32,             // Size of markers in pixels
  showAllMarkers: true,       // Show all markers by default
  debugMode: false,           // Show debug information (disabled by default for performance)
  
  // Performance settings
  maxVisibleMarkers: 500,     // Maximum number of markers to display at once (increased from 50)
  mouseThrottleMs: 50,        // Throttle mouse move events (ms)
  markerRenderDistance: 0.5,  // Only render markers within X% of viewport
  showMarkersOutsideView: true, // Show all markers regardless of viewport position
};

/**
 * Analyze map data to find the exact min/max boundaries
 */
function analyzeMapData(mapData) {
  if (!mapData || !mapData.logs || mapData.logs.length === 0) {
    console.warn("No map data available");
    return {
      dataBounds: { minX: -50000, maxX: 50000, minY: -50000, maxY: 50000 },
      center: { X: 0, Y: 0 },
      centerPoint: null,
      locations: {},
      allPoints: []
    };
  }

  // Find min/max boundaries from data
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;
  
  // Track locations by tag type
  const locations = {
    police: [],
    medical: [],
    shop: [],
    production: [],
    town: [],
    other: []
  };

  // Analyze all points
  mapData.logs.forEach(point => {
    // Update boundaries
    minX = Math.min(minX, point.X);
    maxX = Math.max(maxX, point.X);
    minY = Math.min(minY, point.Y);
    maxY = Math.max(maxY, point.Y);
    
    // Categorize by type
    const tag = point.tag || "";
    if (tag.includes("POLICE")) {
      locations.police.push(point);
    } else if (tag.includes("MEDICAL")) {
      locations.medical.push(point);
    } else if (tag.includes("SHOP")) {
      locations.shop.push(point);
    } else if (tag.includes("PROD")) {
      locations.production.push(point);
    } else if (tag.includes("TOWN") || tag.includes("CITY") || tag.includes("HUB") || tag.includes("JAM")) {
      locations.town.push(point);
    } else {
      locations.other.push(point);
    }
  });

  // Add padding to data bounds
  const xRange = maxX - minX;
  const yRange = maxY - minY;
  const xPadding = xRange * DEFAULT_CONFIG.padding;
  const yPadding = yRange * DEFAULT_CONFIG.padding;
  
  const dataBounds = {
    minX: minX - xPadding,
    maxX: maxX + xPadding,
    minY: minY - yPadding,
    maxY: maxY + yPadding
  };
  
  // Calculate geometric center
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  // Find a center point of interest if requested
  let centerPoint = null;
  if (DEFAULT_CONFIG.centerOnPoint) {
    // Look for a point matching the centerOnPoint substring
    centerPoint = mapData.logs.find(p => 
      p.tag && p.tag.includes(DEFAULT_CONFIG.centerOnPoint)
    );
    
    // If not found, try to find any town-like location
    if (!centerPoint && locations.town.length > 0) {
      centerPoint = locations.town[0];
    }
    
    // If still not found, use a medical point (likely important)
    if (!centerPoint && locations.medical.length > 0) {
      centerPoint = locations.medical[0];
    }
  }
  
  return {
    dataBounds,
    center: { X: centerX, Y: centerY },
    centerPoint,
    locations,
    allPoints: mapData.logs // Make sure we include all points
  };
}

// Analyze the map data - only do this once at load time
const WORLD_DATA = analyzeMapData(map);

// Debug information - only log if debugMode is true at startup
if (DEFAULT_CONFIG.debugMode) {
  console.log("World configuration:", DEFAULT_CONFIG);
  console.log("Data bounds:", WORLD_DATA.dataBounds);
  console.log(`X range: ${WORLD_DATA.dataBounds.minX} to ${WORLD_DATA.dataBounds.maxX}`);
  console.log(`Y range: ${WORLD_DATA.dataBounds.minY} to ${WORLD_DATA.dataBounds.maxY}`);
  console.log(`X span: ${WORLD_DATA.dataBounds.maxX - WORLD_DATA.dataBounds.minX}`);
  console.log(`Y span: ${WORLD_DATA.dataBounds.maxY - WORLD_DATA.dataBounds.minY}`);
  console.log("Initial center point:", WORLD_DATA.centerPoint || WORLD_DATA.center);
}

/**
 * Initial version of coordinate conversion for global scope 
 * Only uses DEFAULT_CONFIG and WORLD_DATA
 */
function initialWorldToGeo(worldX, worldY) {
  const bounds = WORLD_DATA.dataBounds;
  
  // Normalize X coordinate to 0-1 range
  const normalizedX = (worldX - bounds.minX) / (bounds.maxX - bounds.minX);
  
  // Normalize Y coordinate to 0-1 range
  let normalizedY;
  if (DEFAULT_CONFIG.reverseYAxis) {
    normalizedY = 1 - ((worldY - bounds.minY) / (bounds.maxY - bounds.minY));
  } else {
    normalizedY = (worldY - bounds.minY) / (bounds.maxY - bounds.minY);
  }
  
  // Convert to longitude (-180 to 180) and latitude (-85 to 85)
  // Using a slightly narrower range to avoid edge issues
  const longitude = clamp((normalizedX * 350) - 175, -180, 180);
  
  // Use a max of 85 degrees for latitude (instead of 90) to avoid edge issues
  const latitude = clamp((normalizedY * 150) - 75, -85, 85);
  
  return { longitude, latitude };
}

// Calculate the initial center point and convert to geo coordinates
const INITIAL_CENTER = WORLD_DATA.centerPoint || WORLD_DATA.center;
const INITIAL_GEO = initialWorldToGeo(INITIAL_CENTER.X, INITIAL_CENTER.Y);

// Get marker type from tag - moved outside component for perf
const getMarkerType = (tag = "") => {
  if (tag.includes("POLICE")) return "police";
  if (tag.includes("MEDICAL")) return "medical";
  if (tag.includes("SHOP")) return "shop";
  if (tag.includes("PROD")) return "production";
  if (tag.includes("TOWN") || tag.includes("CITY") || tag.includes("HUB") || tag.includes("JAM")) return "town";
  return "other";
};

// Get appropriate icon based on the tag - moved outside component for perf
const getIconByTag = (tag = "") => {
  if (tag.includes("POLICE")) return "Marker_Police";
  if (tag.includes("MEDICAL")) return "Marker_Medical";
  if (tag.includes("SHOP")) return "Marker_Shop";
  if (tag.includes("PROD")) return "Marker_Production";
  if (tag.includes("TOWN") || tag.includes("CITY") || tag.includes("HUB") || tag.includes("JAM")) return "Marker_Town";
  return "Marker_Hideout"; // Default icon
};

// Main component
const GameMap = () => {
  // State for map and UI
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showControls, setShowControls] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [markerTypes, setMarkerTypes] = useState([]);
  const [activeMarkerTypes, setActiveMarkerTypes] = useState([]);
  const [coords, setCoords] = useState({ lng: 0, lat: 0, worldX: 0, worldY: 0 });
  const [viewState, setViewState] = useState({
    longitude: INITIAL_GEO.longitude,
    latitude: INITIAL_GEO.latitude,
    zoom: DEFAULT_CONFIG.initialZoom
  });
  const mapBoundsRef = useRef(null);
  const [mapData, setMapData] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef(null);

  // Memoize the map bounds calculation to avoid recalculations
  const mapBounds = useMemo(() => {
    if (!mapData) return null;
    return calculateMapBounds(mapData, config);
  }, [mapData, config.preset, config.scaleMultiplier, config.padding, config.centerAtZero]);

  // Update the ref when bounds change
  useEffect(() => {
    mapBoundsRef.current = mapBounds;
  }, [mapBounds]);

  /**
   * Component-specific worldToGeo function that has access to component state
   */
  const worldToGeo = useCallback((worldX, worldY, bounds = mapBoundsRef.current) => {
    if (!bounds) return { longitude: 0, latitude: 0 };
    
    // Normalize X coordinate to 0-1 range
    const normalizedX = (worldX - bounds.minX) / (bounds.maxX - bounds.minX);
    
    // Normalize Y coordinate to 0-1 range
    let normalizedY;
    if (config.reverseYAxis) {
      normalizedY = 1 - ((worldY - bounds.minY) / (bounds.maxY - bounds.minY));
    } else {
      normalizedY = (worldY - bounds.minY) / (bounds.maxY - bounds.minY);
    }
    
    // Convert to longitude (-180 to 180) and latitude (-85 to 85)
    // Using a slightly narrower range to avoid edge issues
    const longitude = clamp((normalizedX * 350) - 175, -180, 180);
    
    // Use a max of 85 degrees for latitude (instead of 90) to avoid edge issues
    const latitude = clamp((normalizedY * 150) - 75, -85, 85);
    
    return { longitude, latitude };
  }, [config.reverseYAxis]);

  /**
   * Component-specific geoToWorld function that has access to component state
   */
  const geoToWorld = useCallback((longitude, latitude, bounds = mapBoundsRef.current) => {
    if (!bounds) return { worldX: 0, worldY: 0 };
    
    // Clamp input values to valid ranges
    const clampedLongitude = clamp(longitude, -180, 180);
    const clampedLatitude = clamp(latitude, -85, 85);
    
    // Convert from longitude/latitude to normalized 0-1 coordinates
    const normalizedX = (clampedLongitude + 175) / 350;
    const normalizedY = (clampedLatitude + 75) / 150;
    
    // Convert normalized coordinates to world coordinates
    const worldX = (normalizedX * (bounds.maxX - bounds.minX)) + bounds.minX;
    
    let worldY;
    if (config.reverseYAxis) {
      worldY = bounds.maxY - (normalizedY * (bounds.maxY - bounds.minY));
    } else {
      worldY = (normalizedY * (bounds.maxY - bounds.minY)) + bounds.minY;
    }
    
    // Remove offset for display
    return { 
      worldX: worldX - config.offsetX, 
      worldY: worldY - config.offsetY 
    };
  }, [config.reverseYAxis, config.offsetX, config.offsetY]);

  // Creates a throttled version of the mouse move handler that won't fire too often
  const throttledMouseMove = useCallback(
    throttle((e) => {
      if (!mapBoundsRef.current) return;
      const { worldX, worldY } = geoToWorld(e.lngLat.lng, e.lngLat.lat);
      setCoords({ 
        lng: e.lngLat.lng, 
        lat: e.lngLat.lat,
        worldX,
        worldY
      });
    }, config.mouseThrottleMs),
    [geoToWorld, config.mouseThrottleMs]
  );

  // Handle marker click events
  const handleMarkerClick = useCallback(marker => {
    if (config.debugMode) {
      console.log("Marker clicked:", marker.title);
      console.log("World coordinates:", marker.worldX, marker.worldY);
      console.log("Adjusted coordinates:", marker.adjustedX, marker.adjustedY);
      console.log("Map coordinates:", marker.longitude, marker.latitude);
    }
    
    // Center the map on the clicked marker
    setViewState(vs => ({
      ...vs,
      longitude: marker.longitude,
      latitude: marker.latitude,
      zoom: Math.max(vs.zoom, 3), // Ensure a minimum zoom level
      transitionDuration: 500 // Smooth transition (ms)
    }));
  }, [config.debugMode]);

  // Calculate map data on mount or when config changes
  useEffect(() => {
    // Analyze map data - only need to do this once
    const mapAnalysis = analyzeMapData(map);
    setMapData(mapAnalysis);
    
    // Track marker types for filtering
    const types = Array.from(new Set(
      mapAnalysis.allPoints.map(point => getMarkerType(point.tag))
    ));
    setMarkerTypes(types);
    setActiveMarkerTypes(types);
    
    // Debug info - only log if debug mode is on
    if (config.debugMode) {
      console.log("Map analysis:", mapAnalysis);
    }
    
    setIsMapReady(true);
  }, [config.debugMode]);

  // Handle view state changes and update visible markers
  const handleViewStateChange = useCallback((evt) => {
    setViewState(evt.viewState);
    
    // Skip marker visibility calculation if no markers are loaded yet
    if (filteredMarkers.length === 0) return;
    
    // If showMarkersOutsideView is true, show all filtered markers
    if (config.showMarkersOutsideView) {
      // Show all markers but still respect the max limit for performance
      const limitedMarkers = filteredMarkers.slice(0, config.maxVisibleMarkers);
      
      // Only update if markers changed to avoid unnecessary re-renders
      if (JSON.stringify(limitedMarkers.map(m => m.id)) !== 
          JSON.stringify(visibleMarkers.map(m => m.id))) {
        setVisibleMarkers(limitedMarkers);
      }
      return;
    }
    
    // Calculate which markers are in view based on the current viewport
    // Instead of using mapRef.current.getMap().getBounds() which is causing errors,
    // we'll calculate visibility based on the viewport directly
    const { longitude, latitude, zoom } = evt.viewState;
    
    // Calculate approximate viewport size based on zoom level
    // This is a simplified approximation that works well enough for our purposes
    const zoomFactor = Math.pow(2, zoom);
    const viewportWidth = 360 / zoomFactor;
    const viewportHeight = 170 / zoomFactor;
    
    // Define the viewport bounds with some padding for better user experience
    const renderDistance = config.markerRenderDistance;
    const bounds = {
      west: longitude - (viewportWidth / 2) - (viewportWidth * renderDistance),
      east: longitude + (viewportWidth / 2) + (viewportWidth * renderDistance),
      north: latitude + (viewportHeight / 2) + (viewportHeight * renderDistance),
      south: latitude - (viewportHeight / 2) - (viewportHeight * renderDistance)
    };
    
    // Filter markers to only those in or near the viewport
    const inView = filteredMarkers.filter(marker => 
      marker.longitude >= bounds.west &&
      marker.longitude <= bounds.east &&
      marker.latitude >= bounds.south &&
      marker.latitude <= bounds.north
    );
    
    // Sort by distance to center of view for priority rendering
    const centerLng = longitude;
    const centerLat = latitude;
    
    inView.sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(a.longitude - centerLng, 2) + 
        Math.pow(a.latitude - centerLat, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b.longitude - centerLng, 2) + 
        Math.pow(b.latitude - centerLat, 2)
      );
      return distA - distB;
    });
    
    // Limit the number of visible markers for performance
    const limitedMarkers = inView.slice(0, config.maxVisibleMarkers);
    
    // Only update if markers changed to avoid unnecessary re-renders
    if (JSON.stringify(limitedMarkers.map(m => m.id)) !== 
        JSON.stringify(visibleMarkers.map(m => m.id))) {
      setVisibleMarkers(limitedMarkers);
    }
  }, [filteredMarkers, config.markerRenderDistance, config.maxVisibleMarkers, config.showMarkersOutsideView, visibleMarkers]);

  // Update markers when map data or offsets change
  useEffect(() => {
    if (!mapData || !mapBounds) return;
    
    // Process markers in chunks to avoid blocking the main thread
    const processMarkers = () => {
      // Process all markers from map data
      const processedMarkers = mapData.allPoints.map((point, index) => {
        // Apply offsets before coordinate conversion
        const adjustedX = point.X + config.offsetX;
        const adjustedY = point.Y + config.offsetY;
        const { longitude, latitude } = worldToGeo(adjustedX, adjustedY, mapBounds);
        const type = getMarkerType(point.tag);
        
        return {
          id: `point-${index}`,
          worldX: point.X,
          worldY: point.Y,
          adjustedX,
          adjustedY,
          longitude,
          latitude,
          icon: `/icons/${getIconByTag(point.tag)}.png`,
          title: point.tag || "Unknown",
          type: type
        };
      });
      
      setMarkers(processedMarkers);
      
      // Only log debug info if debug mode is on
      if (config.debugMode && processedMarkers.length > 0) {
        const sampleIndices = [0];
        if (processedMarkers.length > 10) {
          sampleIndices.push(Math.floor(processedMarkers.length / 2));
          sampleIndices.push(processedMarkers.length - 1);
        }
        
        console.log("Sample markers (world → map coordinates):");
        sampleIndices.forEach(index => {
          if (index < processedMarkers.length) {
            const marker = processedMarkers[index];
            console.log(`Marker ${marker.title}:`);
            console.log(`  World: (${marker.worldX.toFixed(2)}, ${marker.worldY.toFixed(2)})`);
            console.log(`  Adjusted: (${marker.adjustedX.toFixed(2)}, ${marker.adjustedY.toFixed(2)})`);
            console.log(`  Map: (${marker.longitude.toFixed(6)}, ${marker.latitude.toFixed(6)})`);
          }
        });
      }
    };
    
    // Use requestAnimationFrame to process markers in the background
    requestAnimationFrame(processMarkers);
  }, [mapData, mapBounds, config.offsetX, config.offsetY, config.debugMode, worldToGeo]);

  // Filter markers when activeMarkerTypes changes or markers update
  useEffect(() => {
    if (!markers.length) return;
    
    const filtered = markers.filter(marker => 
      activeMarkerTypes.includes(marker.type)
    );
    
    setFilteredMarkers(filtered);
    
    // Reset visible markers to force recalculation
    setVisibleMarkers([]);
  }, [markers, activeMarkerTypes]);

  /**
   * Calculate map bounds based on data and configuration
   */
  function calculateMapBounds(mapAnalysis, config) {
    if (!mapAnalysis) return null;
    
    const { dataBounds } = mapAnalysis;
    
    // If using auto preset, use the data bounds with padding
    if (config.preset === "auto") {
      const xRange = dataBounds.maxX - dataBounds.minX;
      const yRange = dataBounds.maxY - dataBounds.minY;
      const xPadding = xRange * config.padding;
      const yPadding = yRange * config.padding;
      
      return {
        minX: dataBounds.minX - xPadding,
        maxX: dataBounds.maxX + xPadding,
        minY: dataBounds.minY - yPadding,
        maxY: dataBounds.maxY + yPadding
      };
    }
    
    // Otherwise, use the preset world size
    const worldSize = MAP_PRESETS[config.preset].worldSize * config.scaleMultiplier;
    const halfSize = worldSize / 2;
    
    if (config.centerAtZero) {
      // Center at (0,0)
      return {
        minX: -halfSize,
        maxX: halfSize,
        minY: -halfSize,
        maxY: halfSize
      };
    } else {
      // Center at data center
      const center = mapAnalysis.center;
      return {
        minX: center.X - halfSize,
        maxX: center.X + halfSize,
        minY: center.Y - halfSize,
        maxY: center.Y + halfSize
      };
    }
  }

  /**
   * Find the initial center point for the map
   */
  function findInitialCenter(mapAnalysis) {
    if (!mapAnalysis) return { X: 0, Y: 0 };
    return mapAnalysis.centerPoint || mapAnalysis.center;
  }

  // Handle marker type toggle
  const handleMarkerTypeToggle = (type, enabled) => {
    setActiveMarkerTypes(prev => {
      if (enabled) {
        return [...prev, type];
      } else {
        return prev.filter(t => t !== type);
      }
    });
  };

  // Handle preset change
  const handlePresetChange = preset => {
    setConfig(prev => ({
      ...prev,
      preset
    }));
  };

  // Handle scale change
  const handleScaleChange = value => {
    setConfig(prev => ({
      ...prev,
      scaleMultiplier: value
    }));
  };

  // Toggle Y-axis direction
  const handleReverseYToggle = checked => {
    setConfig(prev => ({
      ...prev,
      reverseYAxis: checked
    }));
  };

  // Toggle center at zero
  const handleCenterZeroToggle = checked => {
    setConfig(prev => ({
      ...prev,
      centerAtZero: checked
    }));
  };

  // Handle padding change
  const handlePaddingChange = value => {
    setConfig(prev => ({
      ...prev,
      padding: value
    }));
  };

  // Handle marker size change
  const handleMarkerSizeChange = value => {
    setConfig(prev => ({
      ...prev,
      markerSize: value
    }));
  };

  // Handle max visible markers change
  const handleMaxMarkersChange = value => {
    setConfig(prev => ({
      ...prev,
      maxVisibleMarkers: value
    }));
  };

  // Handle X offset change
  const handleOffsetXChange = value => {
    // Limit offset to reasonable values to prevent coordinate issues
    const safeValue = clamp(value, -50000, 50000);
    setConfig(prev => ({
      ...prev,
      offsetX: safeValue
    }));
  };

  // Handle Y offset change
  const handleOffsetYChange = value => {
    // Limit offset to reasonable values to prevent coordinate issues
    const safeValue = clamp(value, -50000, 50000);
    setConfig(prev => ({
      ...prev,
      offsetY: safeValue
    }));
  };

  // Toggle debug mode
  const handleDebugToggle = checked => {
    setConfig(prev => ({
      ...prev,
      debugMode: checked
    }));
  };

  // Toggle showing all markers
  const handleShowAllMarkersToggle = checked => {
    setConfig(prev => ({
      ...prev,
      showMarkersOutsideView: checked
    }));
  };

  // Popup content using Ant Design
  const getPopupContent = marker => (
    <div>
      <h3>{marker.title}</h3>
      <p>World coords: X:{marker.worldX.toFixed(1)}, Y:{marker.worldY.toFixed(1)}</p>
      {config.debugMode && (
        <>
          <p>Adjusted: X:{marker.adjustedX.toFixed(1)}, Y:{marker.adjustedY.toFixed(1)}</p>
          <p>Map coords: {marker.longitude.toFixed(6)}, {marker.latitude.toFixed(6)}</p>
        </>
      )}
      <Button
        type="primary"
        onClick={() => alert(`Action for ${marker.title}`)}
      >
        Action
      </Button>
    </div>
  );

  // Memoize the MapControls component to prevent unnecessary rerenders
  const MapControls = useMemo(() => {
    return (
      <Card 
        className={styles.controlPanel} 
        title="Map Controls" 
        extra={<Button size="small" onClick={() => setShowControls(false)}>×</Button>}
        size="small"
      >
        <div className={styles.controlGroup}>
          <label>World Size Preset:</label>
          <Select 
            value={config.preset}
            onChange={handlePresetChange}
            style={{ width: '100%' }}
            options={Object.entries(MAP_PRESETS).map(([key, preset]) => ({
              value: key,
              label: preset.name
            }))}
          />
        </div>
        
        <div className={styles.controlGroup}>
          <label>Scale Multiplier: {config.scaleMultiplier.toFixed(2)}x</label>
          <Slider 
            min={0.1} 
            max={2} 
            step={0.05} 
            value={config.scaleMultiplier} 
            onChange={handleScaleChange}
          />
        </div>
        
        <div className={styles.controlGroup}>
          <label>Map Padding: {Math.round(config.padding * 100)}%</label>
          <Slider 
            min={0} 
            max={0.5} 
            step={0.01} 
            value={config.padding} 
            onChange={handlePaddingChange}
            disabled={config.preset !== 'auto'}
          />
        </div>

        <div className={styles.controlGroup}>
          <label>Position Fine-tuning:</label>
          <Row gutter={16}>
            <Col span={12}>
              <label>X Offset (Right +)</label>
              <InputNumber
                value={config.offsetX}
                onChange={handleOffsetXChange}
                style={{ width: '100%' }}
                step={500}
                min={-50000}
                max={50000}
              />
            </Col>
            <Col span={12}>
              <label>Y Offset (Up +)</label>
              <InputNumber
                value={config.offsetY}
                onChange={handleOffsetYChange}
                style={{ width: '100%' }}
                step={500}
                min={-50000}
                max={50000}
              />
            </Col>
          </Row>
        </div>
        
        <div className={styles.controlGroup}>
          <label>Marker Size: {config.markerSize}px</label>
          <Slider 
            min={16} 
            max={48} 
            step={2} 
            value={config.markerSize} 
            onChange={handleMarkerSizeChange}
          />
        </div>
        
        <div className={styles.controlGroup}>
          <label>Max Visible Markers: {config.maxVisibleMarkers}</label>
          <Slider 
            min={50} 
            max={2000} 
            step={50} 
            value={config.maxVisibleMarkers} 
            onChange={handleMaxMarkersChange}
          />
        </div>
        
        <div className={styles.switchGroup}>
          <Switch 
            checked={config.reverseYAxis} 
            onChange={handleReverseYToggle}
          />
          <label>Reverse Y-Axis</label>
        </div>
        
        <div className={styles.switchGroup}>
          <Switch 
            checked={config.centerAtZero} 
            onChange={handleCenterZeroToggle}
            disabled={config.preset === 'auto'}
          />
          <label>Center at (0,0)</label>
        </div>
        
        <div className={styles.switchGroup}>
          <Switch 
            checked={config.showMarkersOutsideView} 
            onChange={handleShowAllMarkersToggle}
          />
          <label>Show All Markers (regardless of viewport)</label>
        </div>
        
        <div className={styles.switchGroup}>
          <Switch 
            checked={config.debugMode} 
            onChange={handleDebugToggle}
          />
          <label>Debug Mode (impacts performance)</label>
        </div>
        
        <div className={styles.filterSection}>
          <h4>Filter Markers:</h4>
          <div className={styles.markerFilters}>
            {markerTypes.map(type => (
              <div key={type} className={styles.markerFilter}>
                <Switch 
                  size="small"
                  checked={activeMarkerTypes.includes(type)} 
                  onChange={checked => handleMarkerTypeToggle(type, checked)}
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }, [
    config, 
    markerTypes, 
    activeMarkerTypes,
    handlePresetChange,
    handleScaleChange,
    handlePaddingChange,
    handleOffsetXChange,
    handleOffsetYChange,
    handleMarkerSizeChange,
    handleMaxMarkersChange,
    handleReverseYToggle,
    handleCenterZeroToggle,
    handleShowAllMarkersToggle,
    handleDebugToggle,
    handleMarkerTypeToggle
  ]);

  // Show loading state until map is ready
  if (!isMapReady) {
    return <div className={styles.loadingScreen}>Loading map...</div>;
  }

  // Only update stats in debug mode to avoid performance issues
  const statsDisplay = config.debugMode ? (
    <>
      <div>World: X:{coords.worldX.toFixed(1)}, Y:{coords.worldY.toFixed(1)}</div>
      <div>Map: {coords.lng.toFixed(6)}, {coords.lat.toFixed(6)}</div>
      <div>Markers: {visibleMarkers.length} visible / {filteredMarkers.length} total</div>
    </>
  ) : (
    <div>Use controls to adjust the map</div>
  );

  return (
    <div className={styles.mapContainer}>
      <Map
        {...viewState}
        onMove={handleViewStateChange}
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
            { id: "game-map-layer", type: "raster", source: "game-map" },
          ],
        }}
        reuseMaps={false} // Prevent "already running" error by disabling map reuse
        renderWorldCopies={false}
        onMouseMove={throttledMouseMove}
        mapLib={maplibregl}
        maxZoom={7}
        minZoom={1}
      >
        {visibleMarkers.map(marker => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="center"
          >
            <Popover
              content={getPopupContent(marker)}
              title={marker.title}
              trigger="hover"
              placement="top"
            >
              <div
                onClick={() => handleMarkerClick(marker)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={marker.icon}
                  alt={marker.title}
                  width={config.markerSize}
                  height={config.markerSize}
                />
              </div>
            </Popover>
          </Marker>
        ))}
      </Map>
      
      {/* Coordinate display and controls toggle */}
      <div className={styles.coordsDisplay}>
        {statsDisplay}
        
        {!showControls && (
          <Button 
            size="small"
            type="primary"
            onClick={() => setShowControls(true)}
            style={{ marginTop: '5px' }}
          >
            Show Controls
          </Button>
        )}
      </div>
      
      {/* Map control panel */}
      {showControls && MapControls}
    </div>
  );
};

export default GameMap;
