'use client';

import { useState, useMemo } from 'react';
import type { LatLngLiteral } from 'google.maps';
import { PolygonMap } from '@/components/polygon-map';
import { PointMap } from '@/components/point-map';
import { CodeBlock } from '@/components/code-block';
import { isPointInPolygon, pointInPolygonCode } from '@/lib/geometry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PipResult } from '@/components/pip-result';

type Polygon = LatLngLiteral[];

export function PipValidator() {
  const [polygon, setPolygon] = useState<Polygon>([]);
  const [point, setPoint] = useState<LatLngLiteral | null>(null);

  const result = useMemo(() => {
    if (!point || polygon.length < 3) return null;
    return isPointInPolygon(point, polygon);
  }, [point, polygon]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">
          PIP Validator
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          A tool to demonstrate the Point-in-Polygon problem.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">1. Draw a Polygon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Use the drawing tools on the map to create a polygon.</p>
            <PolygonMap polygon={polygon} onPolygonComplete={setPolygon} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">2. Select a Point</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Click anywhere on the map to select a point.</p>
            <PointMap polygon={polygon} point={point} onPointSelect={setPoint} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">3. Result</CardTitle>
        </CardHeader>
        <CardContent>
          <PipResult point={point} result={result} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Point-in-Polygon Function</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Here is the reference implementation for the point-in-polygon (PIP) check using the Ray Casting algorithm. You can copy it for your own projects.
          </p>
          <CodeBlock code={pointInPolygonCode} />
        </CardContent>
      </Card>
    </div>
  );
}
