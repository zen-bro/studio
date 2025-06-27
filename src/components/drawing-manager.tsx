'use client';

import { useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

type DrawingManagerProps = {
  onPolygonComplete: (polygon: google.maps.Polygon) => void;
};

export const DrawingManager = ({ onPolygonComplete }: DrawingManagerProps) => {
  const map = useMap();
  const coreLib = useMapsLibrary('core');
  const drawingLib = useMapsLibrary('drawing');

  useEffect(() => {
    if (!map || !coreLib || !drawingLib) {
      return;
    }

    const { event, ControlPosition } = coreLib;
    const { DrawingManager } = drawingLib;

    const drawingManager = new DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 0.3,
        strokeColor: 'hsl(var(--primary))',
        strokeWeight: 2,
        editable: false,
        clickable: false,
      },
      drawingMode: null,
    });

    drawingManager.setMap(map);

    const polygonCompleteListener = event.addListener(
      drawingManager,
      'polygoncomplete',
      (polygon: google.maps.Polygon) => {
        onPolygonComplete(polygon);
        drawingManager.setDrawingMode(null);
      }
    );

    const drawingModeListener = event.addListener(
      drawingManager,
      'drawingmode_changed',
      () => {
        const mode = drawingManager.getDrawingMode();
        map.setOptions({
          gestureHandling: mode ? 'none' : 'cooperative',
          draggableCursor: mode ? 'crosshair' : null,
        });
      }
    );

    return () => {
      event.removeListener(polygonCompleteListener);
      event.removeListener(drawingModeListener);
      drawingManager.setMap(null);
    };
  }, [map, coreLib, drawingLib, onPolygonComplete]);

  return null;
};
