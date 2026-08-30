"use client";

import type { ComponentVariant } from "@/lib/component-fs";
import type { VariantSelection } from "@/lib/variant-utils";
import VariantControls from "@/components/variant-controls";
import { buildSelection, selectionFromVariantId } from "@/lib/variant-props";

type Props = {
  variants: ComponentVariant[];
  value: string;
  onChange: (variantId: string) => void;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
};

/** Backward-compatible wrapper — maps variant id to dimensional controls. */
export default function VariantSwitcher({
  variants,
  value,
  onChange,
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Component variant",
}: Props) {
  const selection = selectionFromVariantId(variants, value);

  const handleChange = (next: VariantSelection) => {
    onChange(next.presetId ?? variants[0]?.id ?? value);
  };

  return (
    <VariantControls
      variants={variants}
      selection={selection}
      onChange={handleChange}
      size={size}
      className={className}
      showPresets={false}
      aria-label={ariaLabel}
    />
  );
}

export { buildSelection };
