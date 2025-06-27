'use client';

import { Map, useMapsLibrary, ControlPosition } from '@vis.gl/react-google-maps';
import { Polygon } from '@/components/polygon';
import type { LatLngLiteral } from 'google.maps';
import { DrawingManager } from './drawing-manager';
import { useEffect, useState } from 'react';

const center = { lat: 40.7128, lng: -74.0060 }; // NYC

export function PolygonMap({
  polygon,
  onPolygonComplete,
}: {
  polygon: LatLngLiteral[];
  onPolygonComplete: (polygon: LatLngLiteral[]) => void;
}) {
  const maps = useMapsLibrary('maps');
  const drawing = useMapsLibrary('drawing');
  const [drawingManagerOptions, setDrawingManagerOptions] = useState<google.maps.drawing.DrawingManagerOptions | null>(null);

  useEffect(() => {
    // Only set the options when both the maps and drawing libraries are loaded.
    if (!maps || !drawing) {
      return;
    }

    setDrawingManagerOptions({
      drawingControl: true,
      drawingControlOptions: {
        position: ControlPosition.TOP_CENTER,
        drawingModes: [drawing.DrawingMode.POLYGON],
      },
      polygonOptions: {
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 0.3,
        strokeColor: 'hsl(var(--primary))',
        strokeWeight: 2,
        editable: false,
      },
    });
  }, [maps, drawing]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-inner">
      <Map
        defaultCenter={center}
        defaultZoom={11}
        mapId="polygon-map"
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        gestureHandling="greedy"
      >
        {drawingManagerOptions && (
          <DrawingManager
            onPolygonComplete={googlePolygon => {
              const path = googlePolygon.getPath().getArray().map(p => p.toJSON());
              onPolygonComplete(path);
              googlePolygon.setMap(null);
            }}
            options={drawingManagerOptions}
          />
        )}
        {polygon.length > 0 && (
          <Polygon
            paths={polygon}
            fillColor="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeColor="hsl(var(--primary))"
            strokeWeight={2}
          />
        )}
      </Map>
    </div>
  );
}
