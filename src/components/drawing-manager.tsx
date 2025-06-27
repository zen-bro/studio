'use client';

import { useEffect, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

type DrawingManagerProps = {
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  options?: google.maps.drawing.DrawingManagerOptions;
};

export const DrawingManager = (props: DrawingManagerProps) => {
  const map = useMap();
  const maps = useMapsLibrary('maps');
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

  // Attach event listener
  useEffect(() => {
    if (!drawingManager || !maps) return;

    const listener = maps.event.addListener(
      drawingManager,
      'polygoncomplete',
      props.onPolygonComplete
    );

    return () => {
      maps.event.removeListener(listener);
    };
  }, [drawingManager, maps, props.onPolygonComplete]);

  return null;
};
