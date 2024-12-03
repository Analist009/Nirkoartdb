import React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PromptCopyButtonProps {
  prompt: string;
}

export function PromptCopyButton({ prompt }: PromptCopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('הפרומפט הועתק בהצלחה');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('שגיאה בהעתקת הפרומפט');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span>העתק פרומפט</span>
    </button>
  );
}