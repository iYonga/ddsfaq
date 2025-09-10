/**
 * Client-side coordinate configuration system
 * This module provides dynamic coordinate configuration that can be updated in real-time
 */

// Default coordinate configuration
const DEFAULT_CONFIG = {
  // Reduced padding for tighter coordinate mapping
  paddingX: 0.05, // 5% padding on X-axis
  paddingY: 0.05, // 5% padding on Y-axis

  // Fine-tuning offsets for precise alignment
  offsetX: 0.0, // Additional X offset (-0.02 moves markers left, +0.02 moves right)
  offsetY: 0.0, // Additional Y offset (-0.02 moves markers up, +0.02 moves down)

  // Scale factors for micro-adjustments
  scaleX: 1.0, // X-axis scale multiplier (0.95 shrinks, 1.05 expands)
  scaleY: 1.0, // Y-axis scale multiplier
};

// Reactive configuration state
let coordinateConfig = { ...DEFAULT_CONFIG };
let configListeners = [];

/**
 * Get current coordinate configuration
 */
export function getCoordinateConfig() {
  return { ...coordinateConfig };
}

/**
 * Update coordinate configuration and notify listeners
 */
export function updateCoordinateConfig(updates) {
  coordinateConfig = { ...coordinateConfig, ...updates };

  // Notify all listeners of the configuration change
  configListeners.forEach(listener => listener(coordinateConfig));

  console.log("Coordinate config updated:", coordinateConfig);
  return coordinateConfig;
}

/**
 * Subscribe to configuration changes
 */
export function onConfigChange(listener) {
  configListeners.push(listener);

  // Return unsubscribe function
  return () => {
    configListeners = configListeners.filter(l => l !== listener);
  };
}

/**
 * Reset configuration to defaults
 */
export function resetCoordinateConfig() {
  return updateCoordinateConfig(DEFAULT_CONFIG);
}

/**
 * Preset configurations for common adjustments
 */
export const PRESETS = {
  default: DEFAULT_CONFIG,
  tighter: {
    ...DEFAULT_CONFIG,
    paddingX: 0.03,
    paddingY: 0.03,
  },
  looser: {
    ...DEFAULT_CONFIG,
    paddingX: 0.07,
    paddingY: 0.07,
  },
  moveLeft: {
    ...DEFAULT_CONFIG,
    offsetX: -0.02,
  },
  moveRight: {
    ...DEFAULT_CONFIG,
    offsetX: 0.02,
  },
  moveUp: {
    ...DEFAULT_CONFIG,
    offsetY: -0.02,
  },
  moveDown: {
    ...DEFAULT_CONFIG,
    offsetY: 0.02,
  },
};

/**
 * Apply a preset configuration
 */
export function applyPreset(presetName) {
  if (!PRESETS[presetName]) {
    console.warn(`Preset "${presetName}" not found`);
    return coordinateConfig;
  }

  return updateCoordinateConfig(PRESETS[presetName]);
}

/**
 * Fine-tuning helper functions
 */
export const adjustments = {
  moveLeft: (amount = 0.01) =>
    updateCoordinateConfig({
      offsetX: coordinateConfig.offsetX - amount,
    }),
  moveRight: (amount = 0.01) =>
    updateCoordinateConfig({
      offsetX: coordinateConfig.offsetX + amount,
    }),
  moveUp: (amount = 0.01) =>
    updateCoordinateConfig({
      offsetY: coordinateConfig.offsetY - amount,
    }),
  moveDown: (amount = 0.01) =>
    updateCoordinateConfig({
      offsetY: coordinateConfig.offsetY + amount,
    }),
  tighterBounds: (amount = 0.01) =>
    updateCoordinateConfig({
      paddingX: Math.max(0.01, coordinateConfig.paddingX - amount),
      paddingY: Math.max(0.01, coordinateConfig.paddingY - amount),
    }),
  looserBounds: (amount = 0.01) =>
    updateCoordinateConfig({
      paddingX: coordinateConfig.paddingX + amount,
      paddingY: coordinateConfig.paddingY + amount,
    }),
  scaleDown: (amount = 0.05) =>
    updateCoordinateConfig({
      scaleX: Math.max(0.5, coordinateConfig.scaleX - amount),
      scaleY: Math.max(0.5, coordinateConfig.scaleY - amount),
    }),
  scaleUp: (amount = 0.05) =>
    updateCoordinateConfig({
      scaleX: Math.min(2.0, coordinateConfig.scaleX + amount),
      scaleY: Math.min(2.0, coordinateConfig.scaleY + amount),
    }),
};

// Export for browser console access (client-side only)
if (typeof window !== "undefined") {
  window.coordinateConfig = {
    get: getCoordinateConfig,
    update: updateCoordinateConfig,
    reset: resetCoordinateConfig,
    presets: PRESETS,
    apply: applyPreset,
    adjust: adjustments,
  };
}
