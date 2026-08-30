"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  rootMargin?: string;
  disabled?: boolean;
};

export function useLazyVisible({ rootMargin = "120px", disabled = false }: Options = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, rootMargin]);

  return { ref, visible };
}
