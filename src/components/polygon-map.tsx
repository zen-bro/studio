'use client';

import {Map, ControlPosition, useMapsLibrary} from '@vis.gl/react-google-maps';
import {Polygon} from '@/components/polygon';
import type {LatLngLiteral} from 'google.maps';
import {DrawingManager} from './drawing-manager';
import {useEffect, useState} from 'react';

const center = {lat: 26.9631, lng: -80.1114}; // Tequesta, FL

export function PolygonMap({
  polygon,
  onPolygonComplete,
  mapType,
}: {
  polygon: LatLngLiteral[];
  onPolygonComplete: (polygon: LatLngLiteral[]) => void;
  mapType: string;
}) {
  const [drawingManagerOptions, setDrawingManagerOptions] = useState<google.maps.drawing.DrawingManagerOptions | null>(
    null
  );
  const drawing = useMapsLibrary('drawing');

  useEffect(() => {
    if (!drawing) return;

    setDrawingManagerOptions({
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
      },
    });
  }, [drawing]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-inner">
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="polygon-map"
        mapTypeId={mapType}
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        gestureHandling="cooperative"
      >
        {drawingManagerOptions && (
          <DrawingManager
            onPolygonComplete={(googlePolygon) => {
              const path = googlePolygon
                .getPath()
                .getArray()
                .map((p) => p.toJSON());
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
