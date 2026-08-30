/**
 * Professional artboard sizing for the playground — aligned with common
 * desktop production layouts (1280px content canvas, ~900px initial height).
 */

export const PLAYGROUND_ARTBOARD_WIDTH = 1280;

export const PLAYGROUND_ARTBOARD_MIN_HEIGHT = 900;
export const PLAYGROUND_ARTBOARD_MAX_HEIGHT = 3600;
export const PLAYGROUND_ARTBOARD_BOTTOM_PADDING = 320;

export const PLAYGROUND_SNAP = 16;

/** Full-bleed section on the artboard (32px side inset). */
export const PLAYGROUND_SECTION_WIDTH = 1216;
export const PLAYGROUND_SECTION_HEIGHT = 520;

/** Two-column auto-placement grid. */
export const PLAYGROUND_GRID_COLS = 2;
export const PLAYGROUND_GRID_SIDE_PADDING = 32;
export const PLAYGROUND_GRID_COL_GAP = 32;
export const PLAYGROUND_GRID_ROW_GAP = 56;
export const PLAYGROUND_GRID_TOP_PADDING = 32;
export const PLAYGROUND_GRID_COL_WIDTH = Math.floor(
  (PLAYGROUND_ARTBOARD_WIDTH -
    PLAYGROUND_GRID_SIDE_PADDING * 2 -
    PLAYGROUND_GRID_COL_GAP) /
    PLAYGROUND_GRID_COLS,
);

/** Simpler playground with manual resize handles. */
export const PLAYGROUND_SIMPLE_SECTION_WIDTH = 680;
export const PLAYGROUND_SIMPLE_SECTION_HEIGHT = 420;
export const PLAYGROUND_SIMPLE_MIN_WIDTH = 360;
export const PLAYGROUND_SIMPLE_MIN_HEIGHT = 240;
export const PLAYGROUND_SIMPLE_BASE_HEIGHT = 900;

export function computePlaygroundEditorHeight(maxBottom: number): number {
  return Math.min(
    PLAYGROUND_ARTBOARD_MAX_HEIGHT,
    Math.max(
      PLAYGROUND_ARTBOARD_MIN_HEIGHT,
      Math.ceil(maxBottom + PLAYGROUND_ARTBOARD_BOTTOM_PADDING),
    ),
  );
}

export function playgroundArtboardShellCss(
  width: number = PLAYGROUND_ARTBOARD_WIDTH,
  height: number,
): string {
  return `.complib-editor{position:relative;width:min(100%,${width}px);min-width:${width}px;height:${height}px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:
linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px),
 #f8fafc;background-size:32px 32px;box-shadow:0 30px 80px rgba(0,0,0,0.25);overflow:auto}`;
}

export function playgroundPageShellCss(
  width: number = PLAYGROUND_ARTBOARD_WIDTH,
  height: number,
): string {
  return `.complib-page{position:relative;min-height:${height}px;width:min(100%,${width}px);min-width:${width}px;margin:0 auto;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:auto}`;
}
