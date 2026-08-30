"use client";

import { pg } from "@/components/playground/playground-shell";
import {
  PLAYGROUND_ARTBOARD_WIDTH,
  PLAYGROUND_SIMPLE_MIN_HEIGHT,
  PLAYGROUND_SIMPLE_MIN_WIDTH,
  PLAYGROUND_SNAP,
} from "@/lib/playground-viewport";

export type LayoutValues = {
  width: number;
  height: number;
  heightAuto: boolean;
};

type Props = {
  values: LayoutValues;
  onChange: (patch: Partial<LayoutValues>) => void;
};

function snap(value: number) {
  return Math.round(value / PLAYGROUND_SNAP) * PLAYGROUND_SNAP;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function PlaygroundLayoutPanel({ values, onChange }: Props) {
  const maxWidth = PLAYGROUND_ARTBOARD_WIDTH;

  const setWidth = (raw: number) => {
    onChange({ width: clamp(snap(raw), PLAYGROUND_SIMPLE_MIN_WIDTH, maxWidth) });
  };

  const setHeight = (raw: number) => {
    onChange({
      height: clamp(snap(raw), PLAYGROUND_SIMPLE_MIN_HEIGHT, 2400),
      heightAuto: false,
    });
  };

  return (
    <div className="space-y-2.5">
      <section className={pg.inspectorSection}>
        <p className={pg.inspectorSectionLabel}>Layout width</p>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={PLAYGROUND_SIMPLE_MIN_WIDTH}
            max={maxWidth}
            step={PLAYGROUND_SNAP}
            value={values.width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="min-w-0 flex-1 accent-blue-600"
            aria-label="Component width"
          />
          <input
            type="number"
            min={PLAYGROUND_SIMPLE_MIN_WIDTH}
            max={maxWidth}
            step={PLAYGROUND_SNAP}
            value={values.width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-[4.5rem] rounded-md border border-border/70 bg-background px-2 py-1 text-right font-mono text-[11px]"
            aria-label="Width in pixels"
          />
        </div>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Adjust width only — height stays independent unless you set it below.
        </p>
      </section>

      <section className={pg.inspectorSection}>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className={pg.inspectorSectionLabel}>Layout height</p>
          <label className="flex cursor-pointer items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={values.heightAuto}
              onChange={(e) => onChange({ heightAuto: e.target.checked })}
              className="rounded border-border"
            />
            Auto
          </label>
        </div>
        {!values.heightAuto ? (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={PLAYGROUND_SIMPLE_MIN_HEIGHT}
              max={1600}
              step={PLAYGROUND_SNAP}
              value={values.height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="min-w-0 flex-1 accent-blue-600"
              aria-label="Component height"
            />
            <input
              type="number"
              min={PLAYGROUND_SIMPLE_MIN_HEIGHT}
              max={2400}
              step={PLAYGROUND_SNAP}
              value={values.height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-[4.5rem] rounded-md border border-border/70 bg-background px-2 py-1 text-right font-mono text-[11px]"
              aria-label="Height in pixels"
            />
          </div>
        ) : (
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Height follows content. Turn off Auto to set a fixed frame height.
          </p>
        )}
      </section>
    </div>
  );
}
