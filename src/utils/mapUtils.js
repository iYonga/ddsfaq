// Utility functions for map coordinate conversion
export const MAP_CONFIG = {
  // Map image dimensions in pixels
  IMAGE_WIDTH: 4096,
  IMAGE_HEIGHT: 4096,

  // Estimated world dimensions (you can adjust these based on your game)
  WORLD_WIDTH: 150000,
  WORLD_HEIGHT: 150000,
};

/**
 * Convert world coordinates to normalized coordinates (0-1)
 */
export const worldToNormalized = (worldX, worldY) => ({
  x: worldX / MAP_CONFIG.WORLD_WIDTH,
  y: worldY / MAP_CONFIG.WORLD_HEIGHT,
});

/**
 * Convert normalized coordinates (0-1) to world coordinates
 */
export const normalizedToWorld = (normalizedX, normalizedY) => ({
  x: normalizedX * MAP_CONFIG.WORLD_WIDTH,
  y: normalizedY * MAP_CONFIG.WORLD_HEIGHT,
});

/**
 * Convert world coordinates to pixel coordinates on the map image
 */
export const worldToPixel = (worldX, worldY) => ({
  x: (worldX / MAP_CONFIG.WORLD_WIDTH) * MAP_CONFIG.IMAGE_WIDTH,
  y: (worldY / MAP_CONFIG.WORLD_HEIGHT) * MAP_CONFIG.IMAGE_HEIGHT,
});

/**
 * Convert pixel coordinates to world coordinates
 */
export const pixelToWorld = (pixelX, pixelY) => ({
  x: (pixelX / MAP_CONFIG.IMAGE_WIDTH) * MAP_CONFIG.WORLD_WIDTH,
  y: (pixelY / MAP_CONFIG.IMAGE_HEIGHT) * MAP_CONFIG.WORLD_HEIGHT,
});

/**
 * Convert normalized coordinates to pixel coordinates for display
 */
export const normalizedToPixel = (
  normalizedX,
  normalizedY,
  displayWidth,
  displayHeight,
) => ({
  x: normalizedX * displayWidth,
  y: normalizedY * displayHeight,
});

/**
 * Get distance between two world coordinates
 */
export const getWorldDistance = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Parse Z coordinate from your map data to get elevation
 */
export const parseElevation = zValue => {
  return typeof zValue === "number" ? zValue : 0;
};
