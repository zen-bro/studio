import type { LatLngLiteral } from 'google.maps';

export type PipResultDetails = {
  isInside: boolean;
  explanation: string;
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

  let explanation = `Point-in-Polygon Test using Ray Casting Algorithm\n`;
  explanation += `-------------------------------------------------\n`;
  explanation += `Test Point (P): (x=${x.toFixed(6)}, y=${y.toFixed(6)})\n\n`;
  explanation += `The algorithm casts a horizontal ray from P to the right and counts intersections with polygon edges. An odd number of intersections means the point is inside.\n\n`;
  explanation += `Polygon Edges Analysis:\n`;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;

    explanation += `\nEdge ${i + 1}: Vertex ${i}(xᵢ=${xi.toFixed(6)}, yᵢ=${yi.toFixed(6)}) to Vertex ${j}(xⱼ=${xj.toFixed(6)}, yⱼ=${yj.toFixed(6)})\n`;
    
    const yCondition = ((yi > y) !== (yj > y));
    explanation += `1. Is point's y between edge's y-coords? ((yᵢ > y) != (yⱼ > y))\n`;
    explanation += `   ((${yi.toFixed(6)} > ${y.toFixed(6)}) != (${yj.toFixed(6)} > ${y.toFixed(6)})) -> (${yi > y} != ${yj > y}) -> ${yCondition}\n`;

    if (yCondition) {
      const intersectX = (xj - xi) * (y - yi) / (yj - yi) + xi;
      const xCondition = (x < intersectX);
      explanation += `2. Is point's x to the left of intersection x? (x < x_intersect)\n`;
      explanation += `   x_intersect = (xⱼ - xᵢ) * (y - yᵢ) / (yⱼ - yᵢ) + xᵢ\n`;
      explanation += `   x_intersect = (${xj.toFixed(6)} - ${xi.toFixed(6)}) * (${y.toFixed(6)} - ${yi.toFixed(6)}) / (${yj.toFixed(6)} - ${yi.toFixed(6)}) + ${xi.toFixed(6)} = ${intersectX.toFixed(6)}\n`;
      explanation += `   Is ${x.toFixed(6)} < ${intersectX.toFixed(6)}? -> ${xCondition}\n`;
      
      if (xCondition) {
        isInside = !isInside;
        explanation += `   Intersection found! Current intersections: ${isInside ? 'odd' : 'even'}. Toggling isInside to ${isInside}.\n`;
      } else {
        explanation += `   No intersection. Point is to the right.\n`;
      }
    } else {
      explanation += `   No intersection. Ray does not cross this edge's y-span.\n`;
    }
  }

  explanation += `\nFinal Result\n`;
  explanation += `-------------------------------------------------\n`;
  explanation += `Total intersections are ${isInside ? 'odd' : 'even'}. Point is ${isInside ? 'INSIDE' : 'OUTSIDE'} the polygon.\n`;
  
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
