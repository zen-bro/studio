'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Polygon } from '@/components/polygon';
import type { LatLngLiteral } from 'google.maps';

const center = { lat: 26.9631, lng: -80.1114 }; // Tequesta, FL

export function PointMap({
  polygon,
  point,
  onPointSelect,
  mapType,
}: {
  polygon: LatLngLiteral[];
  point: LatLngLiteral | null;
  onPointSelect: (point: LatLngLiteral) => void;
  mapType: string;
}) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-inner">
      <Map
        defaultCenter={center}
        defaultZoom={13}
        mapId="point-map"
        mapTypeId={mapType}
        onClick={e => e.latLng && onPointSelect(e.latLng.toJSON())}
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        gestureHandling="cooperative"
      >
        {polygon.length > 0 && (
          <Polygon
            paths={polygon}
            fillColor="hsl(var(--primary))"
            fillOpacity={0.1}
            strokeColor="hsl(var(--primary))"
            strokeWeight={1}
            strokeOpacity={0.5}
            clickable={false}
          />
        )}
        {point && <AdvancedMarker position={point} />}
      </Map>
    </div>
  );
}
