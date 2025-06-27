'use client';

import { Map } from '@vis.gl/react-google-maps';
import { Polygon } from '@/components/polygon';
import type { LatLngLiteral } from 'google.maps';
import { DrawingManager } from './drawing-manager';

const center = { lat: 26.9631, lng: -80.1114 }; // Tequesta, FL

export function PolygonMap({
  polygon,
  onPolygonComplete,
  mapType,
}: {
  polygon: LatLngLiteral[];
  onPolygonComplete: (polygon: LatLngLiteral[]) => void;
  mapType: string;
}) {
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
        clickableIcons={false}
      >
        <DrawingManager
          onPolygonComplete={(googlePolygon) => {
            const path = googlePolygon
              .getPath()
              .getArray()
              .map((p) => p.toJSON());
            onPolygonComplete(path);
            googlePolygon.setMap(null); // Hide the temporary polygon drawn by the manager
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
