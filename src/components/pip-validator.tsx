'use client';

import { useState, useCallback, useEffect } from 'react';
import type { LatLngLiteral } from 'google.maps';
import { PolygonMap } from '@/components/polygon-map';
import { PointMap } from '@/components/point-map';
import { CodeBlock } from '@/components/code-block';
import { isPointInPolygon, pointInPolygonCode, pointInPolygonCodePython, PipResultDetails } from '@/lib/geometry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PipResult } from '@/components/pip-result';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Polygon = LatLngLiteral[];

export function PipValidator() {
  const [polygon, setPolygon] = useState<Polygon>([]);
  const [point, setPoint] = useState<LatLngLiteral | null>(null);
  const [mapType, setMapType] = useState<string>('satellite');
  const [pipDetails, setPipDetails] = useState<PipResultDetails | null>(null);

  useEffect(() => {
    if (point && polygon.length >= 3) {
      const details = isPointInPolygon(point, polygon);
      setPipDetails(details);
    } else {
      setPipDetails(null);
    }
  }, [point, polygon]);

  const handlePolygonComplete = useCallback((newPolygon: Polygon) => {
    setPolygon(newPolygon);
  }, []);

  const handlePointSelect = useCallback((newPoint: LatLngLiteral) => {
    setPoint(newPoint);
  }, []);

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
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Map Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Label htmlFor="map-type-select" className="text-sm font-medium">Map Type</Label>
            <Select
              value={mapType}
              onValueChange={(value) => setMapType(value)}
            >
              <SelectTrigger id="map-type-select" className="w-[180px]">
                <SelectValue placeholder="Select map type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="roadmap">Roadmap</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">1. Draw a Polygon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Use the drawing tools on the map to create a polygon.</p>
            <PolygonMap polygon={polygon} onPolygonComplete={handlePolygonComplete} mapType={mapType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">2. Select a Point</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Click anywhere on the map to select a point.</p>
            <PointMap point={point} onPointSelect={handlePointSelect} mapType={mapType} />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">3. Result</CardTitle>
        </CardHeader>
        <CardContent>
          <PipResult point={point} result={pipDetails ? pipDetails.isInside : null} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <Label htmlFor="polygon-points" className="text-sm font-medium">Polygon Points (for debugging)</Label>
          <Textarea
            id="polygon-points"
            readOnly
            value={polygon.length > 0 ? JSON.stringify(polygon, null, 2) : "No polygon drawn yet."}
            className="mt-2 font-mono text-xs h-32 bg-muted"
          />
        </div>
        <div>
          <Label htmlFor="point-coords" className="text-sm font-medium">Selected Point (for debugging)</Label>
          <Textarea
            id="point-coords"
            readOnly
            value={point ? JSON.stringify(point, null, 2) : "No point selected yet."}
            className="mt-2 font-mono text-xs h-32 bg-muted"
          />
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-headline">Math for Latitude/Longitude to Geographic Coordinate System (GCS) Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="pip-explanation"
            readOnly
            value={pipDetails ? pipDetails.explanation : "Draw a polygon and select a point to see the calculation."}
            className="font-mono text-xs h-96 bg-muted"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Point-in-Polygon Function</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Here is the reference implementation for the point-in-polygon (PIP) check using the Ray Casting algorithm in both TypeScript and Python. You can copy it for your own projects.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">TypeScript</h3>
              <CodeBlock code={pointInPolygonCode} />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Python 3.12+</h3>
              <CodeBlock code={pointInPolygonCodePython} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
