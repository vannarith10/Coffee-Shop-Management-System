// components/ui/ButtonCopy.tsx
//

import { Copy } from "lucide-react";
import { useState } from "react";

export default function ButtonCopy({
  url,
  size = 20,
}: {
  url: string | null;
  size?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs active:scale-70 cursor-pointer ${!copied && "hover:bg-background-secondary-hover"} p-2 rounded-full transition-all duration-200 ease-out outline-none`}
    >
      {copied ? "Copied" : <Copy size={size} />}
    </button>
  );
}
