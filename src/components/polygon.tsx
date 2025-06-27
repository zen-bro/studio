'use client';

import { useEffect, useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

type PolygonProps = google.maps.PolygonOptions;

export const Polygon = (props: PolygonProps) => {
  const map = useMap();
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polygon) {
      setPolygon(new google.maps.Polygon(props));
    } else {
      polygon.setOptions(props);
    }
  }, [map, polygon, props]);

  useEffect(() => {
    if (!map || !polygon) return;
    
    polygon.setMap(map);

    return () => {
      if (polygon) {
        polygon.setMap(null);
      }
    };
  }, [map, polygon]);

  return null;
};
