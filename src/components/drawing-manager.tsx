'use client';

import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

type DrawingManagerProps = {
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
  options?: google.maps.drawing.DrawingManagerOptions;
};

export const DrawingManager = (props: DrawingManagerProps) => {
  const map = useMap();
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

  // Create/destroy drawing manager
  useEffect(() => {
    if (!map || !google.maps.drawing) return;

    const dm = new google.maps.drawing.DrawingManager();
    dm.setMap(map);
    setDrawingManager(dm);

    return () => {
      dm.setMap(null);
    };
  }, [map]);

  // Update options
  useEffect(() => {
    if (!drawingManager) return;
    drawingManager.setOptions(props.options ?? {});
  }, [drawingManager, props.options]);

  // Attach event listener
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

  return null;
};
