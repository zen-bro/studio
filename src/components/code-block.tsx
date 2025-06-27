'use client';

import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CodeBlock({ code }: { code: string }) {
  const { toast } = useToast();
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.trim());
    toast({
      title: "Copied to clipboard!",
      description: "The function code is ready to be pasted.",
    });
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-code">
        <code>{code.trim()}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={copyToClipboard}
        aria-label="Copy code"
      >
        {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
