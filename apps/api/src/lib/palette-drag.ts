import type { PaletteDragPayload } from "@/components/playground/palette-types";

export const PALETTE_DRAG_MIME = "application/x-complib-palette";

export function isPaletteDragEvent(dataTransfer: DataTransfer | null): boolean {
  if (!dataTransfer) return false;
  return Array.from(dataTransfer.types).includes(PALETTE_DRAG_MIME);
}

export function writePaletteDragData(
  dataTransfer: DataTransfer,
  payload: PaletteDragPayload,
): void {
  const json = JSON.stringify(payload);
  dataTransfer.setData(PALETTE_DRAG_MIME, json);
  dataTransfer.setData("text/plain", payload.slug);
  dataTransfer.effectAllowed = "copy";
  // Transparent 1×1 drag image — avoids blocking the canvas drop target.
  const ghost = document.createElement("div");
  ghost.style.cssText = "position:fixed;top:-1000px;left:-1000px;width:1px;height:1px;opacity:0";
  document.body.appendChild(ghost);
  dataTransfer.setDragImage(ghost, 0, 0);
  requestAnimationFrame(() => ghost.remove());
}

export function readPaletteDragData(
  dataTransfer: DataTransfer,
): PaletteDragPayload | null {
  const raw = dataTransfer.getData(PALETTE_DRAG_MIME);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as PaletteDragPayload;
      if (parsed && typeof parsed.slug === "string" && parsed.style) {
        return parsed;
      }
    } catch {
      // fall through
    }
  }

  const slug = dataTransfer.getData("text/plain").trim();
  if (!slug) return null;
  return { slug, style: { id: "default", label: "Default", props: {} } };
}
