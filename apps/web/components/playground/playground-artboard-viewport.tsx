"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CanvasDeviceFrame, pg, PlaygroundSegmented } from "@/components/playground/playground-shell";

export type ArtboardZoom = "fit" | "50" | "75" | "100";

const CHROME_BAR_HEIGHT = 36;
const VIEWPORT_PADDING = 24;

export const ZOOM_OPTIONS: Array<{ value: ArtboardZoom; label: string }> = [
  { value: "fit", label: "Fit page" },
  { value: "50", label: "50%" },
  { value: "75", label: "75%" },
  { value: "100", label: "100%" },
];

export function zoomToScale(zoom: ArtboardZoom): number {
  if (zoom === "fit") return -1; // sentinel — resolved with container
  return Number(zoom) / 100;
}

/** Scale artboard to fit container width and height, or use fixed zoom. */
export function resolveArtboardScale(
  zoom: ArtboardZoom,
  containerWidth: number,
  containerHeight: number,
  artboardWidth: number,
  frameHeight: number,
): number {
  if (zoom !== "fit") return zoomToScale(zoom);
  if (containerWidth <= 0 || containerHeight <= 0) return 1;
  const scaleW = (containerWidth - VIEWPORT_PADDING) / artboardWidth;
  const scaleH = (containerHeight - VIEWPORT_PADDING) / frameHeight;
  return Math.min(1, scaleW, scaleH);
}

export function mapArtboardCoords(
  scale: number,
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

type Props = {
  width: number;
  height: number;
  label?: string;
  zoom: ArtboardZoom;
  onZoomChange: (zoom: ArtboardZoom) => void;
  onScaleChange?: (scale: number) => void;
  children: ReactNode;
  overlay?: ReactNode;
  emptyState?: ReactNode;
  showZoomBar?: boolean;
};

export default function PlaygroundArtboardViewport({
  width,
  height,
  label,
  zoom,
  onZoomChange,
  onScaleChange,
  children,
  overlay,
  emptyState,
  showZoomBar = true,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () =>
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const frameHeight = CHROME_BAR_HEIGHT + height;

  const scale = useMemo(
    () =>
      resolveArtboardScale(
        zoom,
        containerSize.w,
        containerSize.h,
        width,
        frameHeight,
      ),
    [zoom, containerSize.w, containerSize.h, width, frameHeight],
  );

  useEffect(() => {
    onScaleChange?.(scale);
  }, [scale, onScaleChange]);

  const scaledWidth = width * scale;
  const scaledHeight = frameHeight * scale;

  const fitsInView =
    containerSize.w > 0 &&
    containerSize.h > 0 &&
    scaledWidth <= containerSize.w - VIEWPORT_PADDING / 2 &&
    scaledHeight <= containerSize.h - VIEWPORT_PADDING / 2;

  return (
    <div className={pg.canvasStage}>
      {showZoomBar ? (
        <div className={pg.canvasViewportBar}>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <PlaygroundSegmented
              aria-label="Artboard zoom"
              size="sm"
              options={ZOOM_OPTIONS}
              value={zoom}
              onChange={onZoomChange}
            />
            <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
              {Math.round(scale * 100)}%
              {zoom === "fit" ? " · fit width & height" : ""}
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {width} × {height}px
          </span>
        </div>
      ) : null}

      <div ref={scrollRef} className={pg.canvasWell}>
        <div
          className={`${pg.canvasWellInner} ${
            fitsInView ? pg.canvasWellInnerFit : pg.canvasWellInnerScroll
          }`}
        >
          <div
            className={pg.artboardSlot}
            style={{
              width: scaledWidth,
              height: scaledHeight,
              minHeight: scaledHeight,
            }}
          >
            <div
              className={pg.artboardInner}
              style={{ width, transform: `scale(${scale})` }}
            >
              <CanvasDeviceFrame width={width} height={height} label={label}>
                {children}
                {overlay}
              </CanvasDeviceFrame>
            </div>
          </div>
        </div>

        {emptyState ? <div className={pg.canvasEmptyOverlay}>{emptyState}</div> : null}
      </div>
    </div>
  );
}
