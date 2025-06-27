'use client';

import { Map, DrawingManager } from '@vis.gl/react-google-maps';
import { Polygon } from '@/components/polygon';
import type { LatLngLiteral } from 'google.maps';

const center = { lat: 40.7128, lng: -74.0060 }; // NYC

export function PolygonMap({
  polygon,
  onPolygonComplete,
}: {
  polygon: LatLngLiteral[];
  onPolygonComplete: (polygon: LatLngLiteral[]) => void;
}) {
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
        <DrawingManager
          onPolygonComplete={googlePolygon => {
            const path = googlePolygon.getPath().getArray().map(p => p.toJSON());
            onPolygonComplete(path);
            googlePolygon.setMap(null);
          }}
          options={{
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.DrawingMode.POLYGON],
            },
            polygonOptions: {
              fillColor: 'hsl(var(--primary))',
              fillOpacity: 0.3,
              strokeColor: 'hsl(var(--primary))',
              strokeWeight: 2,
              editable: false,
            },
          }}
        />
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
