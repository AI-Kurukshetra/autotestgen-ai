"use client";

import { Check, Copy, Download } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

import { getCodeLanguage, getFileExtension } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CodeViewerProps = {
  code: string;
  framework: string;
  language: string;
  url: string;
};

export function CodeViewer({
  code,
  framework,
  language,
  url
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const prismLanguage = getCodeLanguage(language);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const extension = getFileExtension(language);
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeFramework = framework.toLowerCase().replace(/\s+/g, "-");
    const safeHost = new URL(url).hostname.replace(/[^\w.-]/g, "-");

    link.href = blobUrl;
    link.download = `${safeFramework}-${safeHost}.${extension}`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-stone-950 text-stone-50 shadow-panel">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-display text-xl">{framework}</p>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-stone-400">
            {language} test output
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={handleDownload} variant="accent" size="sm">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Highlight code={code} language={prismLanguage} theme={themes.vsDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-5 text-sm`}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, index) => (
              <div key={index} {...getLineProps({ line })}>
                <span className="mr-3 inline-block w-6 select-none text-right text-stone-500 sm:mr-4 sm:w-8">
                  {index + 1}
                </span>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
