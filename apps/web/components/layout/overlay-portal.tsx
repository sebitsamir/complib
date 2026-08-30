"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
};

/** Render overlays on document.body so fixed UI is not clipped by header backdrop-filter. */
export default function OverlayPortal({ children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}
