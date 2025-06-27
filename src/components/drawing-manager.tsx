'use client';

import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

type DrawingManagerProps = {
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  options?: google.maps.drawing.DrawingManagerOptions;
};

export const DrawingManager = (props: DrawingManagerProps) => {
  const map = useMap();
  const drawing = useMapsLibrary('drawing');
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  // Create/destroy drawing manager
  useEffect(() => {
    if (!map || !drawing) return;

    const dm = new drawing.DrawingManager();
    dm.setMap(map);
    setDrawingManager(dm);

    return () => {
      dm.setMap(null);
    };
  }, [map, drawing]);

  // Update options
  useEffect(() => {
    if (!drawingManager) return;
    drawingManager.setOptions(props.options ?? {});
  }, [drawingManager, props.options]);

  // Attach polygon complete event listener
  useEffect(() => {
    if (!drawingManager) return;

    const listener = google.maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      props.onPolygonComplete
    );

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [drawingManager, props.onPolygonComplete]);

  // Listen for drawing mode changes to disable/enable map gestures
  useEffect(() => {
    if (!drawingManager || !map) return;

    const listener = google.maps.event.addListener(
      drawingManager,
      'drawingmode_changed',
      () => {
        const mode = drawingManager.getDrawingMode();
        if (mode) {
          // A drawing tool is active, disable map gestures and set cursor.
          map.setOptions({ 
            gestureHandling: 'none',
            draggableCursor: 'crosshair'
          });
        } else {
          // No drawing tool is active, enable cooperative map gestures and reset cursor.
          map.setOptions({ 
            gestureHandling: 'cooperative',
            draggableCursor: null // Let the map use its default
          });
        }
      }
    );

    return () => {
      google.maps.event.removeListener(listener);
      // Ensure gestures are re-enabled and cursor is reset when the component unmounts.
      if (map.getGestureHandling() !== 'cooperative') {
        map.setOptions({ 
          gestureHandling: 'cooperative',
          draggableCursor: null
        });
      }
    };
  }, [drawingManager, map]);


  return null;
};
