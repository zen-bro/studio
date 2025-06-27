import { PipValidator } from '@/components/pip-validator';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
           <CardHeader>
            <CardTitle className="font-headline text-2xl">Configuration Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Google Maps API Key is missing. Please add it to your environment variables to continue.
            </p>
            <div className="mt-4 rounded-md bg-muted p-3 text-sm">
              <p className="font-semibold">Create a <code className="font-mono">.env.local</code> file in the root of your project with the following content:</p>
              <pre className="mt-2 text-muted-foreground font-mono text-xs">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['drawing']}>
      <main className="min-h-screen bg-background text-foreground">
        <PipValidator />
      </main>
    </APIProvider>
  );
}
