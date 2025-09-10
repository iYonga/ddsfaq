import { useState, useEffect, useCallback } from "react";

/**
 * Dynamic Coordinate Configuration Component
 * Provides client-side reactive coordinate configuration for map positioning
 */
export default function CoordinateConfig({ onConfigChange, initialBounds }) {
  const [config, setConfig] = useState({
    // Reduced padding for tighter coordinate mapping
    paddingX: 0.05, // 5% padding on X-axis
    paddingY: 0.05, // 5% padding on Y-axis

    // Fine-tuning offsets for precise alignment
    offsetX: 0.0, // Additional X offset
    offsetY: 0.0, // Additional Y offset

    // Scale factors for micro-adjustments
    scaleX: 1.0, // X-axis scale multiplier
    scaleY: 1.0, // Y-axis scale multiplier
  });

  const [worldBounds, setWorldBounds] = useState(null);
  const [mapBounds, setMapBounds] = useState(null);

  // Calculate map bounds whenever config or initial bounds change
  useEffect(() => {
    if (!initialBounds) return;

    const X_PADDING =
      (initialBounds.maxX - initialBounds.minX) * config.paddingX;
    const Y_PADDING =
      (initialBounds.maxY - initialBounds.minY) * config.paddingY;

    const newMapBounds = {
      minX: initialBounds.minX - X_PADDING,
      maxX: initialBounds.maxX + X_PADDING,
      minY: initialBounds.minY - Y_PADDING,
      maxY: initialBounds.maxY + Y_PADDING,
    };

    setWorldBounds(initialBounds);
    setMapBounds(newMapBounds);

    // Notify parent component of configuration change
    if (onConfigChange) {
      onConfigChange({
        config,
        bounds: newMapBounds,
        dataBounds: initialBounds,
        dimensions: {
          width: newMapBounds.maxX - newMapBounds.minX,
          height: newMapBounds.maxY - newMapBounds.minY,
        },
      });
    }
  }, [config, initialBounds, onConfigChange]);

  // Update configuration
  const updateConfig = useCallback(updates => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      console.log("Coordinate config updated:", newConfig);
      return newConfig;
    });
  }, []);

  // Preset configurations
  const presets = {
    default: {
      paddingX: 0.05,
      paddingY: 0.05,
      offsetX: 0.0,
      offsetY: 0.0,
      scaleX: 1.0,
      scaleY: 1.0,
    },
    tight: {
      paddingX: 0.02,
      paddingY: 0.02,
      offsetX: 0.0,
      offsetY: 0.0,
      scaleX: 1.0,
      scaleY: 1.0,
    },
    loose: {
      paddingX: 0.1,
      paddingY: 0.1,
      offsetX: 0.0,
      offsetY: 0.0,
      scaleX: 1.0,
      scaleY: 1.0,
    },
  };

  // Apply preset
  const applyPreset = useCallback(
    presetName => {
      if (presets[presetName]) {
        updateConfig(presets[presetName]);
      }
    },
    [updateConfig],
  );

  // Fine adjustment functions
  const adjustments = {
    moveLeft: () => updateConfig({ offsetX: config.offsetX - 0.01 }),
    moveRight: () => updateConfig({ offsetX: config.offsetX + 0.01 }),
    moveUp: () => updateConfig({ offsetY: config.offsetY - 0.01 }),
    moveDown: () => updateConfig({ offsetY: config.offsetY + 0.01 }),
    tighter: () =>
      updateConfig({
        paddingX: Math.max(0.01, config.paddingX - 0.01),
        paddingY: Math.max(0.01, config.paddingY - 0.01),
      }),
    looser: () =>
      updateConfig({
        paddingX: config.paddingX + 0.01,
        paddingY: config.paddingY + 0.01,
      }),
    shrinkX: () =>
      updateConfig({ scaleX: Math.max(0.5, config.scaleX - 0.05) }),
    expandX: () =>
      updateConfig({ scaleX: Math.min(2.0, config.scaleX + 0.05) }),
    shrinkY: () =>
      updateConfig({ scaleY: Math.max(0.5, config.scaleY - 0.05) }),
    expandY: () =>
      updateConfig({ scaleY: Math.min(2.0, config.scaleY + 0.05) }),
    reset: () => updateConfig(presets.default),
  };

  // Expose functions to global scope for console access
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.coordConfig = {
        update: updateConfig,
        adjust: adjustments,
        presets: applyPreset,
        current: () => config,
        bounds: () => ({ world: worldBounds, map: mapBounds }),
      };
    }
  }, [updateConfig, adjustments, applyPreset, config, worldBounds, mapBounds]);

  return {
    config,
    worldBounds,
    mapBounds,
    updateConfig,
    adjustments,
    applyPreset,
    presets: Object.keys(presets),
  };
}

/**
 * Hook for using coordinate configuration in components
 */
export function useCoordinateConfig(initialBounds) {
  const [configData, setConfigData] = useState(null);

  const handleConfigChange = useCallback(newConfigData => {
    setConfigData(newConfigData);
  }, []);

  const configComponent = CoordinateConfig({
    onConfigChange: handleConfigChange,
    initialBounds,
  });

  return {
    ...configComponent,
    configData,
  };
}

/**
 * Coordinate conversion function using dynamic configuration
 */
export function convertWorldToNormalized(worldX, worldY, configData) {
  if (!configData) {
    console.warn("No config data available for coordinate conversion");
    return { x: 0, y: 0 };
  }

  const { config, bounds } = configData;
  const mapWidth = bounds.maxX - bounds.minX;
  const mapHeight = bounds.maxY - bounds.minY;

  // Convert world coordinates to normalized coordinates (0-1) with fine-tuning
  let normalizedX = (worldX - bounds.minX) / mapWidth;
  let normalizedY = 1 - (worldY - bounds.minY) / mapHeight; // Invert Y axis

  // Apply fine-tuning adjustments
  normalizedX = normalizedX * config.scaleX + config.offsetX;
  normalizedY = normalizedY * config.scaleY + config.offsetY;

  return {
    x: normalizedX,
    y: normalizedY,
  };
}
