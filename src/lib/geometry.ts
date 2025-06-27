import type { LatLngLiteral } from 'google.maps';

/**
 * Determines if a point is inside a polygon using the Ray Casting algorithm.
 * @param point The point to check, with lat and lng properties.
 * @param polygon An array of points representing the polygon's vertices.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export const isPointInPolygon = (point: LatLngLiteral, polygon: LatLngLiteral[]): boolean => {
  let isInside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }

  return isInside;
};

export const pointInPolygonCode = `
import type { LatLngLiteral } from 'google.maps';

/**
 * Determines if a point is inside a polygon using the Ray Casting algorithm.
 * @param point The point to check, with lat and lng properties.
 * @param polygon An array of points representing the polygon's vertices.
 * @returns True if the point is inside the polygon, false otherwise.
 */
export const isPointInPolygon = (point: LatLngLiteral, polygon: LatLngLiteral[]): boolean => {
  let isInside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }

  return isInside;
};
`;
