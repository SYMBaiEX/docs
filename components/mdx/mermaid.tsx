"use client";

import mermaid from "mermaid";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

interface MermaidProps {
  chart: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  themeVariables: {
    lightMode: true,
  },
});

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const theme = resolvedTheme === "dark" ? "dark" : "default";
    mermaid.initialize({
      startOnLoad: false,
      theme,
      themeVariables: {
        lightMode: resolvedTheme !== "dark",
      },
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Error rendering mermaid chart:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500">Error rendering chart: ${error}</div>`;
        }
      }
    };

    renderChart();
  }, [chart, resolvedTheme]);

  return (
    <div className="my-6 flex items-center justify-center overflow-x-auto">
      <div ref={containerRef} />
    </div>
  );
}