import type { LatLngLiteral } from 'google.maps';

export type PipResultDetails = {
  isInside: boolean;
  explanation: string;
};

const decimalToDMS = (decimal: number, isLng: boolean): string => {
  const absDecimal = Math.abs(decimal);
  const degrees = Math.floor(absDecimal);
  const minutesFloat = (absDecimal - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);
  
  let direction = '';
  if (isLng) {
    direction = decimal >= 0 ? 'E' : 'W';
  } else {
    direction = decimal >= 0 ? 'N' : 'S';
  }

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
};


/**
 * Determines if a point is inside a polygon using the Ray Casting algorithm.
 * @param point The point to check, with lat and lng properties.
 * @param polygon An array of points representing the polygon's vertices.
 * @returns An object containing the boolean result and a step-by-step explanation.
 */
export const isPointInPolygon = (point: LatLngLiteral, polygon: LatLngLiteral[]): PipResultDetails => {
  let isInside = false;
  const x = point.lng;
  const y = point.lat;
  let intersections = 0;

  let explanation = `Geographic Coordinate System (GCS) to Degrees, Minutes, Seconds (DMS) Conversion\n`;
  explanation += `-------------------------------------------------\n`;
  explanation += `A point on the globe is represented in the GCS using Latitude and Longitude. Here's the conversion from decimal degrees to the DMS format for the selected point.\n\n`;
  
  explanation += `Latitude Conversion (φ):\n`;
  explanation += `  - Decimal: ${point.lat.toFixed(6)}\n`;
  explanation += `  - DMS: ${decimalToDMS(point.lat, false)}\n\n`;

  explanation += `Longitude Conversion (λ):\n`;
  explanation += `  - Decimal: ${point.lng.toFixed(6)}\n`;
  explanation += `  - DMS: ${decimalToDMS(point.lng, true)}\n\n`;

  explanation += `-------------------------------------------------\n`;
  explanation += `Point-in-Polygon Test (Ray Casting Algorithm)\n`;
  explanation += `-------------------------------------------------\n`;
  explanation += `To perform the 2D test, we project the GCS coordinates to a flat plane (x: Longitude, y: Latitude). A ray is cast from the point, and intersections with polygon edges are counted.\n\n`;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      isInside = !isInside;
      intersections++;
    }
  }

  explanation += `Ray Casting Result:\n`;
  explanation += `  - Total Intersections: ${intersections}\n`;
  explanation += `  - An odd number of intersections means the point is inside.\n\n`;
  
  explanation += `Final Conclusion:\n`;
  explanation += `  - The point is ${isInside ? 'INSIDE' : 'OUTSIDE'} the polygon.\n`;
  
  return { isInside, explanation };
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

export const pointInPolygonCodePython = `
def is_point_in_polygon(point: dict, polygon: list[dict]) -> bool:
    """
    Determines if a point is inside a polygon using the Ray Casting algorithm.
    This implementation is written in pure Python 3.12+ with no external libraries.

    Args:
        point (dict): The point to check, expecting 'lat' and 'lng' keys.
        polygon (list[dict]): A list of points representing the polygon's 
                              vertices. Each point is a dict with 'lat' and 
                              'lng' keys.

    Returns:
        bool: True if the point is inside the polygon, False otherwise.
    """
    is_inside = False
    # Use longitude for x and latitude for y for a 2D plane projection
    x = point["lng"]
    y = point["lat"]

    num_vertices = len(polygon)
    j = num_vertices - 1  # Previous vertex index
    
    for i in range(num_vertices):
        xi, yi = polygon[i]["lng"], polygon[i]["lat"]
        xj, yj = polygon[j]["lng"], polygon[j]["lat"]

        # Check if the horizontal ray from the point at (x, y) intersects
        # with the edge defined by vertices i and j.
        y_intersects = ((yi > y) != (yj > y))
        x_intersection = (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        if y_intersects and x_intersection:
            is_inside = not is_inside
        
        j = i  # Move to the next edge

    return is_inside
`;
