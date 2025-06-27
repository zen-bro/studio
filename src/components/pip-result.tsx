'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { LatLngLiteral } from 'google.maps';

export function PipResult({
  point,
  result,
}: {
  point: LatLngLiteral | null;
  result: boolean | null;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-6 bg-muted/50 rounded-lg">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground">Clicked Point</h3>
        <p className="font-mono text-lg">{point ? `${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}` : 'N/A'}</p>
      </div>
      <Separator orientation="vertical" className="h-12 hidden sm:block" />
      <Separator orientation="horizontal" className="w-24 sm:hidden" />
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground">Is it inside the polygon?</h3>
        {result === null ? (
          <p className="font-bold text-lg text-muted-foreground">Draw a polygon and select a point.</p>
        ) : (
          <Badge
            variant={result ? 'default' : 'destructive'}
            className={cn(
              'text-lg font-bold px-4 py-2',
              result && 'bg-green-600 text-primary-foreground hover:bg-green-700 border-transparent'
            )}
          >
            {result ? 'Inside' : 'Outside'}
          </Badge>
        )}
      </div>
    </div>
  )
}
