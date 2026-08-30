"use client";

import { useLayoutEffect, useRef, useState } from "react";

export const HERO_MESH_CELL = 40;

function snapOffsets(width: number, height: number, cell: number) {
  const remainderX = width % cell;
  const remainderY = height % cell;
  return {
    x: remainderX / 2,
    y: remainderY,
  };
}

export default function HeroMesh({ cell = HERO_MESH_CELL }: { cell?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const section = ref.current?.parentElement;
    if (!section) return;

    const sync = () => {
      const { width, height } = section.getBoundingClientRect();
      const { x, y } = snapOffsets(width, height, cell);
      setPosition({ x, y });
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(section);
    return () => observer.disconnect();
  }, [cell]);

  return (
    <>
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-35"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--grid-line)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--grid-line)) 1px, transparent 1px)
          `,
          backgroundSize: `${cell}px ${cell}px`,
          backgroundPosition: `${position.x}px ${position.y}px`,
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 35%, black 15%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 35%, black 15%, transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 animate-mesh-drift opacity-50 dark:opacity-30"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(circle at 18% 28%, hsl(var(--accent) / 0.1), transparent 42%),
            radial-gradient(circle at 82% 55%, hsl(var(--accent) / 0.08), transparent 38%)
          `,
        }}
      />
    </>
  );
}
