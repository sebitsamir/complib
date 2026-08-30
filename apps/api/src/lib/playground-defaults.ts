import {
  PLAYGROUND_ARTBOARD_WIDTH,
  PLAYGROUND_GRID_COL_GAP,
  PLAYGROUND_GRID_COLS,
  PLAYGROUND_GRID_COL_WIDTH,
  PLAYGROUND_GRID_ROW_GAP,
  PLAYGROUND_GRID_SIDE_PADDING,
  PLAYGROUND_GRID_TOP_PADDING,
  PLAYGROUND_SECTION_HEIGHT,
  PLAYGROUND_SECTION_WIDTH,
  PLAYGROUND_SNAP,
} from "./playground-viewport";

export type PlacementFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  heightAuto: boolean;
};

function snap(v: number) {
  return Math.round(v / PLAYGROUND_SNAP) * PLAYGROUND_SNAP;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

/** Compact defaults tuned for the Phase-1 primitive catalog (not page sections). */
const SLUG_FRAMES: Record<string, { width: number; height: number }> = {
  button: { width: 200, height: 72 },
  "icon-button": { width: 120, height: 72 },
  input: { width: 360, height: 110 },
  textarea: { width: 400, height: 180 },
  select: { width: 360, height: 110 },
  checkbox: { width: 320, height: 64 },
  radio: { width: 320, height: 120 },
  switch: { width: 320, height: 64 },
  slider: { width: 360, height: 100 },
  range: { width: 360, height: 120 },
  "file-upload": { width: 420, height: 180 },
  "search-input": { width: 360, height: 72 },
  combobox: { width: 360, height: 160 },
  "date-input": { width: 280, height: 110 },
  "time-input": { width: 240, height: 110 },
  heading: { width: 560, height: 140 },
  text: { width: 480, height: 80 },
  paragraph: { width: 560, height: 140 },
  label: { width: 280, height: 64 },
  link: { width: 360, height: 64 },
  code: { width: 520, height: 140 },
  "inline-code": { width: 420, height: 64 },
  blockquote: { width: 520, height: 160 },
  list: { width: 480, height: 180 },
  "truncated-text": { width: 400, height: 120 },
  badge: { width: 240, height: 64 },
  avatar: { width: 200, height: 96 },
  chip: { width: 320, height: 72 },
  kbd: { width: 360, height: 64 },
  skeleton: { width: 400, height: 120 },
  box: { width: 360, height: 140 },
  flex: { width: 640, height: 140 },
  grid: { width: 720, height: 200 },
  stack: { width: 420, height: 220 },
  hstack: { width: 640, height: 100 },
  vstack: { width: 360, height: 220 },
  container: { width: 720, height: 160 },
  section: { width: PLAYGROUND_SECTION_WIDTH, height: 220 },
  center: { width: 480, height: 220 },
  spacer: { width: 360, height: 64 },
  divider: { width: 640, height: 48 },
  "aspect-ratio": { width: 480, height: 280 },
  absolute: { width: 420, height: 180 },
  sticky: { width: 480, height: 240 },
  overlay: { width: 520, height: 220 },
  "scroll-area": { width: 360, height: 220 },
  "visually-hidden": { width: 280, height: 100 },
  "focus-ring": { width: 360, height: 120 },
  surface: { width: 360, height: 140 },
  separator: { width: 360, height: 100 },
};

const LAYER_FRAMES: Record<string, { width: number; height: number }> = {
  inputs: { width: 360, height: 110 },
  typography: { width: 520, height: 120 },
  "data-display": { width: 320, height: 96 },
  utility: { width: 360, height: 140 },
  layout: { width: 560, height: 180 },
};

export function defaultFrameForComponent(
  slug: string,
  layer?: string | null,
): { width: number; height: number; heightAuto: boolean } {
  const bySlug = SLUG_FRAMES[slug];
  if (bySlug) {
    return { ...bySlug, heightAuto: true };
  }
  const byLayer = layer ? LAYER_FRAMES[layer] : undefined;
  if (byLayer) {
    return { ...byLayer, heightAuto: true };
  }
  return {
    width: Math.min(PLAYGROUND_GRID_COL_WIDTH, 480),
    height: 140,
    heightAuto: true,
  };
}

export function autoGridPlacementForComponent(
  index: number,
  slug: string,
  layer?: string | null,
): PlacementFrame {
  const frame = defaultFrameForComponent(slug, layer);
  const col = index % PLAYGROUND_GRID_COLS;
  const row = Math.floor(index / PLAYGROUND_GRID_COLS);
  const colWidth = Math.min(frame.width, PLAYGROUND_GRID_COL_WIDTH);
  const rowStride = Math.max(frame.height, 120) + PLAYGROUND_GRID_ROW_GAP;
  const x = clamp(
    PLAYGROUND_GRID_SIDE_PADDING + col * (PLAYGROUND_GRID_COL_WIDTH + PLAYGROUND_GRID_COL_GAP),
    0,
    PLAYGROUND_ARTBOARD_WIDTH - colWidth,
  );
  const y = row * rowStride + PLAYGROUND_GRID_TOP_PADDING;
  return {
    x: snap(x),
    y: snap(y),
    width: colWidth,
    height: frame.height,
    heightAuto: true,
  };
}

/** Preferred quick-insert chips for empty canvas (curated, not alphabetical). */
export const PLAYGROUND_QUICK_INSERT = [
  "button",
  "input",
  "heading",
  "stack",
  "badge",
] as const;

export { PLAYGROUND_SECTION_HEIGHT, PLAYGROUND_SECTION_WIDTH };
