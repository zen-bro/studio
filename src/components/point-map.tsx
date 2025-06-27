'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { Polygon } from '@/components/polygon';
import type { LatLngLiteral } from 'google.maps';

const center = { lat: 40.7128, lng: -74.0060 }; // NYC

export function PointMap({
  polygon,
  point,
  onPointSelect,
}: {
  polygon: LatLngLiteral[];
  point: LatLngLiteral | null;
  onPointSelect: (point: LatLngLiteral) => void;
}) {
  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border shadow-inner">
      <Map
        defaultCenter={center}
        defaultZoom={11}
        mapId="point-map"
        onClick={e => e.latLng && onPointSelect(e.latLng.toJSON())}
        fullscreenControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        gestureHandling="greedy"
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
