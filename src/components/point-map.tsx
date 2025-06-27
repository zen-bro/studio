'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { LatLngLiteral } from 'google.maps';

const center = { lat: 26.9631, lng: -80.1114 }; // Tequesta, FL

export function PointMap({
  point,
  onPointSelect,
  mapType,
}: {
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
        clickableIcons={false}
      >
        {/* The polygon is intentionally not rendered here to allow for point selection without visual bias. The point is still evaluated against the polygon from the other map. */}
        {point && <AdvancedMarker position={point} />}
      </Map>
    </div>
  );
}
