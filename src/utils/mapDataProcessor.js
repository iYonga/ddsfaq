import mapData from "../resources/map.json";

// Import the official marker category database
let markerDatabase = null;
let isLoadingDatabase = false;

/**
 * Load marker database asynchronously
 */
async function loadMarkerDatabase() {
  if (markerDatabase || isLoadingDatabase) return markerDatabase;

  isLoadingDatabase = true;
  try {
    if (typeof window !== "undefined") {
      const response = await fetch("/MapMarkerCategoryDatabase.json");
      const data = await response.json();
      markerDatabase = data[0]?.Rows || {};
      console.log("Loaded marker database:", Object.keys(markerDatabase));
    }
  } catch (err) {
    console.warn("Failed to load marker database:", err);
    markerDatabase = {}; // Fallback to empty object
  }
  isLoadingDatabase = false;
  return markerDatabase;
}

// First, let's analyze the coordinate bounds from the actual data
function getCoordinateBounds() {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  mapData.logs.forEach(entry => {
    minX = Math.min(minX, entry.X);
    maxX = Math.max(maxX, entry.X);
    minY = Math.min(minY, entry.Y);
    maxY = Math.max(maxY, entry.Y);
  });

  return { minX, maxX, minY, maxY };
}

// Get the actual bounds from the data
const bounds = getCoordinateBounds();
console.log("Coordinate bounds:", bounds);

/**
 * Process raw map data and convert to normalized coordinates
 * @param {Object} configData - Dynamic coordinate configuration data
 */
export async function processMapData(configData = null) {
  // Ensure marker database is loaded
  await loadMarkerDatabase();

  const locations = [];
  const tagStats = {};

  mapData.logs.forEach((entry, index) => {
    const { tag, X, Y, Z, timestamp } = entry;
    // Count tag occurrences
    tagStats[tag] = (tagStats[tag] || 0) + 1; // Convert world coordinates to normalized coordinates using dynamic config
    let normalizedCoords;
    if (configData) {
      // Use the new dynamic coordinate conversion
      import("../components/CoordinateConfig").then(module => {
        normalizedCoords = module.convertWorldToNormalized(X, Y, configData);
      });
    } else {
      // Fallback to basic conversion for when config is not available yet
      const mapWidth = bounds.maxX - bounds.minX;
      const mapHeight = bounds.maxY - bounds.minY;
      const padding = 0.05; // 5% padding

      const paddedMinX = bounds.minX - mapWidth * padding;
      const paddedMaxX = bounds.maxX + mapWidth * padding;
      const paddedMinY = bounds.minY - mapHeight * padding;
      const paddedMaxY = bounds.maxY + mapHeight * padding;

      normalizedCoords = {
        x: (X - paddedMinX) / (paddedMaxX - paddedMinX),
        y: 1 - (Y - paddedMinY) / (paddedMaxY - paddedMinY), // Invert Y axis
      };
    }

    // Debug: log if coordinates are outside bounds
    if (
      normalizedCoords.x < 0 ||
      normalizedCoords.x > 1 ||
      normalizedCoords.y < 0 ||
      normalizedCoords.y > 1
    ) {
      console.warn(
        `Location ${tag} at world coords (${X}, ${Y}) has normalized coords (${normalizedCoords.x.toFixed(
          3,
        )}, ${normalizedCoords.y.toFixed(3)}) outside 0-1 range`,
      );
    }

    // Create location object
    const markerCategory = getMarkerCategory(tag);
    const markerInfo = getMarkerInfo(markerCategory);

    const location = {
      id: `${tag}_${index}`,
      name: formatLocationName(tag),
      category: markerCategory,
      tag,
      markerInfo,
      coordinates: {
        world: { x: X, y: Y, z: Z },
        normalized: normalizedCoords,
      },
      timestamp,
      description: generateDescription(tag),
    };

    locations.push(location);
  });

  // Add test markers if config data is available
  if (configData) {
    const testMarkers = createTestMarkers(configData);
    locations.push(...testMarkers);
  }

  return {
    locations,
    tagStats,
    categories: getCategoriesInfo(locations),
  };
}

/**
 * Create test markers for coordinate verification
 */
function createTestMarkers(configData) {
  const { bounds } = configData;

  // Center marker
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerY = (bounds.minY + bounds.maxY) / 2;

  const testLocation = {
    id: "test_center",
    name: "Test Center (Map Center)",
    category: "LOCATION",
    tag: "TEST-CENTER",
    markerInfo: {
      icon: null,
      iconPath: null,
      color: "#ff0000",
      hexColor: "ff0000",
    },
    coordinates: {
      world: { x: centerX, y: centerY, z: 0 },
      normalized: { x: 0.5, y: 0.5 },
    },
    timestamp: Date.now(),
    description: "Test marker at map center - should appear at center of PNG",
  };

  // Corner markers
  const testCorners = [
    {
      id: "test_top_left",
      name: "Top Left Corner",
      tag: "TEST-TL",
      color: "#00ff00",
      world: { x: bounds.minX, y: bounds.maxY, z: 0 },
      normalized: { x: 0, y: 0 },
    },
    {
      id: "test_top_right",
      name: "Top Right Corner",
      tag: "TEST-TR",
      color: "#0000ff",
      world: { x: bounds.maxX, y: bounds.maxY, z: 0 },
      normalized: { x: 1, y: 0 },
    },
    {
      id: "test_bottom_left",
      name: "Bottom Left Corner",
      tag: "TEST-BL",
      color: "#ffff00",
      world: { x: bounds.minX, y: bounds.minY, z: 0 },
      normalized: { x: 0, y: 1 },
    },
    {
      id: "test_bottom_right",
      name: "Bottom Right Corner",
      tag: "TEST-BR",
      color: "#ff00ff",
      world: { x: bounds.maxX, y: bounds.minY, z: 0 },
      normalized: { x: 1, y: 1 },
    },
  ];

  const testMarkers = [testLocation];

  testCorners.forEach(corner => {
    testMarkers.push({
      id: corner.id,
      name: corner.name,
      category: "LOCATION",
      tag: corner.tag,
      markerInfo: {
        icon: null,
        iconPath: null,
        color: corner.color,
        hexColor: corner.color.substring(1),
      },
      coordinates: {
        world: corner.world,
        normalized: corner.normalized,
      },
      timestamp: Date.now(),
      description: `Test marker at ${corner.name.toLowerCase()} of map bounds`,
    });
  });

  console.log("Added test location at map center:", testLocation.coordinates);
  console.log("Added test corner markers to verify coordinate mapping");

  return testMarkers;
}

/**
 * Get coordinate bounds from actual data
 */
export function getDataBounds() {
  return bounds;
}

/**
 * Format tag name to readable location name
 */
function formatLocationName(tag) {
  const nameMap = {
    "POLICE-STATION": "Police Station",
    "MEDICAL-POINT": "Medical Point",
    "PROD-COKE-ENTER": "Coke Production Entrance",
    "PROD-RAB": "RAB Production",
    "SHOP-STR-FUN": "Street Fun Shop",
    "SHOP-DRUG-BLUE-METH": "Blue Meth Shop",
    "SHOP-VOL-RAVE": "Rave Volume Shop",
    "SHOP-VOL-SUBEQ": "SubEQ Volume Shop",
    "SHOP-JAM-HARD": "Hard Jam Shop",
    "SHOP-JAM-LABEQ": "Lab Equipment Jam Shop",
    "SHOP-JAM-SOFT": "Soft Jam Shop",
    "SHOP-JAM-VOL": "Volume Jam Shop",
    "SHOP-STR-SOFT": "Street Soft Shop",
    "SHOP-STR-HARD": "Street Hard Shop",
    "SHOP-STR-VOL": "Street Volume Shop",
    "SHOP-DRUG-WEED": "Weed Shop",
    "SHOP-DRUG-HEROIN": "Heroin Shop",
    "SHOP-DRUG-COCAINE": "Cocaine Shop",
    "SHOP-DRUG-METH": "Meth Shop",
    "SHOP-DRUG-MDMA": "MDMA Shop",
    "SHOP-DRUG-LSD": "LSD Shop",
    "PROD-WEED": "Weed Production",
    "PROD-HEROIN": "Heroin Production",
    "PROD-COCAINE": "Cocaine Production",
    "PROD-METH": "Meth Production",
    "PROD-MDMA": "MDMA Production",
    "PROD-LSD": "LSD Production",
  };

  return (
    nameMap[tag] ||
    tag
      .replace(/-/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase())
  );
}

/**
 * Map tag to official marker category
 */
function getMarkerCategory(tag) {
  // Direct mappings to official categories
  const categoryMap = {
    "POLICE-STATION": "MILI-POINT", // Military/Security point
    "MEDICAL-POINT": "MILI-POINT", // Medical point
    "PROD-COKE-ENTER": "PRODUCER",
    "PROD-RAB": "PRODUCER",
    "PROD-WEED": "PRODUCER",
    "PROD-HEROIN": "PRODUCER",
    "PROD-COCAINE": "PRODUCER",
    "PROD-METH": "PRODUCER",
    "PROD-MDMA": "PRODUCER",
    "PROD-LSD": "PRODUCER",
    "SHOP-STR-FUN": "SHOP-FUN",
    "SHOP-DRUG-BLUE-METH": "SHOP",
    "SHOP-VOL-RAVE": "SHOP",
    "SHOP-VOL-SUBEQ": "SHOP",
    "SHOP-JAM-HARD": "SHOP",
    "SHOP-JAM-LABEQ": "SHOP",
    "SHOP-JAM-SOFT": "SHOP",
    "SHOP-JAM-VOL": "SHOP",
    "SHOP-STR-SOFT": "SHOP",
    "SHOP-STR-HARD": "SHOP",
    "SHOP-STR-VOL": "SHOP",
    "SHOP-DRUG-WEED": "SHOP",
    "SHOP-DRUG-HEROIN": "SHOP",
    "SHOP-DRUG-COCAINE": "SHOP",
    "SHOP-DRUG-METH": "SHOP",
    "SHOP-DRUG-MDMA": "SHOP",
    "SHOP-DRUG-LSD": "SHOP",
    "SHOP-PAWN": "SHOP-PAWN",
    "BUS-STOP": "BUS-STOP",
    "BOAT-STOP": "BOAT-STOP",
    PHONEBOOTH: "PHONEBOOTH",
    "CLIENT-SPAWN": "CLIENT-SPAWN",
    DEALER: "DEALER",
    NPC: "NPC",
    HIDEOUT: "HIDEOUT",
    BREAKIN: "BREAKIN",
    PARKING: "PARKING",
    PARTY: "PARTY",
  };

  return categoryMap[tag] || "LOCATION"; // Default to generic location
}

/**
 * Get marker info from official database
 */
function getMarkerInfo(category) {
  if (!markerDatabase || !markerDatabase[category]) {
    return {
      icon: null,
      color: "#888888", // Default gray
      hexColor: "888888",
    };
  }

  const marker = markerDatabase[category];
  const colorCoding = marker.ColorCoding || {};

  // Convert RGB values (0-1) to hex
  const r = Math.round((colorCoding.R || 0) * 255);
  const g = Math.round((colorCoding.G || 0) * 255);
  const b = Math.round((colorCoding.B || 0) * 255);
  const hexColor = ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
  return {
    icon: marker.CategoryIcon?.ObjectPath || null,
    iconPath: getIconPath(marker.CategoryIcon?.ObjectPath),
    color: `#${hexColor}`,
    hexColor: colorCoding.Hex || hexColor,
    originalColor: colorCoding,
  };
}

/**
 * Generate description for location
 */
function generateDescription(tag) {
  const descriptions = {
    "POLICE-STATION":
      "Law enforcement facility. Avoid when carrying illegal substances.",
    "MEDICAL-POINT": "Medical facility for health recovery and treatment.",
    "PROD-COKE-ENTER": "Entrance to cocaine production facility.",
    "PROD-RAB": "RAB production facility.",
    "SHOP-STR-FUN": "Street shop selling fun items and entertainment.",
    "SHOP-DRUG-BLUE-METH": "Specialized shop for blue methamphetamine.",
    "SHOP-VOL-RAVE": "Volume shop catering to rave scene.",
    "SHOP-VOL-SUBEQ": "SubEQ volume equipment shop.",
    "SHOP-JAM-HARD": "Shop selling hard jam equipment.",
    "SHOP-JAM-LABEQ": "Laboratory equipment for jam production.",
  };

  if (descriptions[tag]) return descriptions[tag];

  // Generate generic descriptions based on category
  if (tag.includes("PROD"))
    return "Production facility for illegal substances.";
  if (tag.includes("SHOP-DRUG")) return "Illegal drug retail location.";
  if (tag.includes("SHOP")) return "Retail shop for various items.";

  return "Important location in the game world.";
}

/**
 * Get categories information with counts using official marker database
 */
function getCategoriesInfo(locations) {
  const categories = {};

  locations.forEach(location => {
    const category = location.category;
    if (!categories[category]) {
      const markerInfo = getMarkerInfo(category);
      categories[category] = {
        count: 0,
        color: markerInfo.color,
        label: getCategoryLabel(category),
        icon: markerInfo.icon,
        hexColor: markerInfo.hexColor,
      };
    }
    categories[category].count++;
  });

  return categories;
}

/**
 * Get color for category
 */
function getCategoryColor(category) {
  const colors = {
    security: "#ff4444",
    medical: "#44ff44",
    production: "#ffaa44",
    shop: "#4444ff",
    other: "#888888",
  };
  return colors[category] || "#888888";
}

/**
 * Get category label from official names or generate readable name
 */
function getCategoryLabel(category) {
  const labelMap = {
    LOCATION: "Locations",
    SHOP: "Shops",
    "SHOP-FUN": "Entertainment",
    "SHOP-PAWN": "Pawn Shops",
    PRODUCER: "Production",
    "BUS-STOP": "Bus Stops",
    "BOAT-STOP": "Boat Stops",
    PHONEBOOTH: "Phone Booths",
    "CLIENT-SPAWN": "Client Spawns",
    CLIENT: "Clients",
    DEALER: "Dealers",
    NPC: "NPCs",
    HIDEOUT: "Hideouts",
    BREAKIN: "Break-in Areas",
    PARKING: "Parking",
    PARTY: "Parties",
    "MILI-POINT": "Security Points",
    "POINT-OF-INTEREST": "Points of Interest",
  };

  return (
    labelMap[category] ||
    category.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  );
}

/**
 * Get unique tags and their counts
 */
export function getTagStatistics() {
  const { tagStats } = processMapData();
  return Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({
      tag,
      count,
      name: formatLocationName(tag),
      category: getMarkerCategory(tag),
    }));
}

/**
 * Filter locations by category
 */
export function filterLocationsByCategory(locations, categories) {
  if (!categories || categories.length === 0) return locations;
  return locations.filter(location => categories.includes(location.category));
}

/**
 * Filter locations by tag
 */
export function filterLocationsByTag(locations, tags) {
  if (!tags || tags.length === 0) return locations;
  return locations.filter(location => tags.includes(location.tag));
}

/**
 * Convert game icon ObjectPath to actual file path
 */
function getIconPath(objectPath) {
  if (!objectPath) return null;

  // Extract the texture name from the ObjectPath
  // Example: "/Game/GUI/Images/MapMarkers/Marker_Point.0" -> "Marker_Point"
  const match = objectPath.match(/\/([^\/]+)\.0?$/);
  if (!match) return null;

  const iconName = match[1];
  return `/icons/${iconName}.png`;
}

export { getIconPath };
